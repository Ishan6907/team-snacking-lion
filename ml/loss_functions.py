"""
Mathematical loss functions combining Cross-Entropy and Focal Loss
References:
1. Categorical Cross-Entropy & Binary Cross-Entropy (Gombru, 2018):
   https://gombru.github.io/2018/05/23/cross_entropy_loss/
2. Focal Loss for Dense Object Detection & Class Imbalance (Lin et al., Towards Data Science):
   https://towardsdatascience.com/focal-loss-a-better-alternative-for-cross-entropy-1d073d92d075/
"""

import numpy as np
from typing import Optional, Union, Tuple

EPSILON = 1e-12


def softmax(logits: np.ndarray) -> np.ndarray:
    """
    Numerically stable Softmax using the LogSumExp / max-subtraction trick.
    logits: shape (N, C)
    returns: shape (N, C) probabilities where sum along axis 1 is 1.0.
    """
    shift_logits = logits - np.max(logits, axis=-1, keepdims=True)
    exp_logits = np.exp(shift_logits)
    return exp_logits / np.sum(exp_logits, axis=-1, keepdims=True)


def sigmoid(logits: np.ndarray) -> np.ndarray:
    """
    Numerically stable Sigmoid activation: 1 / (1 + exp(-z)).
    """
    return np.where(
        logits >= 0,
        1.0 / (1.0 + np.exp(-logits)),
        np.exp(logits) / (1.0 + np.exp(logits))
    )


class CrossEntropyLoss:
    """
    Categorical Cross-Entropy Loss:
    L_CE = - (1/N) * sum_{n=1}^N sum_{c=1}^C y_{n, c} * log(p_{n, c} + eps)
    
    As detailed in Gombru (2018):
    - Measures divergence between ground-truth one-hot distribution and predicted probabilities.
    - Softmax is applied to raw logits when from_logits=True.
    """
    def __init__(self, from_logits: bool = True, weight: Optional[np.ndarray] = None, eps: float = EPSILON):
        self.from_logits = from_logits
        self.weight = weight  # Class weights shape (C,)
        self.eps = eps

    def __call__(self, y_true: np.ndarray, y_pred: np.ndarray) -> float:
        """
        y_true: One-hot encoded ground truth (N, C) or class indices (N,)
        y_pred: Raw logits or softmax probabilities (N, C)
        """
        N, C = y_pred.shape
        if y_true.ndim == 1:
            y_one_hot = np.zeros((N, C), dtype=np.float32)
            y_one_hot[np.arange(N), y_true] = 1.0
        else:
            y_one_hot = y_true

        probs = softmax(y_pred) if self.from_logits else y_pred
        probs = np.clip(probs, self.eps, 1.0 - self.eps)

        loss_per_sample = -np.sum(y_one_hot * np.log(probs), axis=-1)

        if self.weight is not None:
            # Weighted cross-entropy: sum_{c} w_c * y_c * log(p_c)
            weights_per_sample = np.sum(y_one_hot * self.weight, axis=-1)
            loss_per_sample = loss_per_sample * weights_per_sample

        return float(np.mean(loss_per_sample))

    def gradient(self, y_true: np.ndarray, y_pred_logits: np.ndarray) -> np.ndarray:
        """
        Analytical gradient d(L_CE)/d(z_i) = p_i - y_i (scaled by 1/N).
        """
        N, C = y_pred_logits.shape
        if y_true.ndim == 1:
            y_one_hot = np.zeros((N, C), dtype=np.float32)
            y_one_hot[np.arange(N), y_true] = 1.0
        else:
            y_one_hot = y_true

        probs = softmax(y_pred_logits)
        grad = (probs - y_one_hot) / N
        if self.weight is not None:
            weights_per_sample = np.sum(y_one_hot * self.weight, axis=-1, keepdims=True)
            grad = grad * weights_per_sample
        return grad


class FocalLoss:
    """
    Multi-Class Focal Loss (Lin et al., RetinaNet):
    L_FL = - (1/N) * sum_{n=1}^N sum_{c=1}^C alpha_c * (1 - p_{n, c})^gamma * y_{n, c} * log(p_{n, c} + eps)
    
    Key Properties (from Towards Data Science analysis):
    1. Modulating Factor: (1 - p_t)^gamma
       - When p_t -> 1 (easy, well-classified example), (1 - p_t)^gamma -> 0.
         Loss is down-weighted by a factor of 100x when gamma=2, p_t=0.9!
       - When p_t -> 0 (hard misclassified example), (1 - p_t)^gamma -> 1.
         Loss is fully retained.
    2. Focusing Parameter gamma:
       - gamma = 0: Equivalent to standard Cross-Entropy Loss.
       - gamma = 2: Standard recommended value for heavy class imbalance.
    3. Alpha Weighting:
       - Inversely balances class frequencies, ensuring minority delay classes get proportional updates.
    """
    def __init__(
        self,
        gamma: float = 2.0,
        alpha: Optional[Union[float, np.ndarray]] = None,
        from_logits: bool = True,
        eps: float = EPSILON,
    ):
        self.gamma = gamma
        self.alpha = alpha
        self.from_logits = from_logits
        self.eps = eps

    def __call__(self, y_true: np.ndarray, y_pred: np.ndarray) -> float:
        N, C = y_pred.shape
        if y_true.ndim == 1:
            y_one_hot = np.zeros((N, C), dtype=np.float32)
            y_one_hot[np.arange(N), y_true] = 1.0
        else:
            y_one_hot = y_true

        probs = softmax(y_pred) if self.from_logits else y_pred
        probs = np.clip(probs, self.eps, 1.0 - self.eps)

        # Modulating factor (1 - p_c)^gamma
        modulating_factor = np.power(1.0 - probs, self.gamma)

        # Focal cross entropy per class
        focal_loss_matrix = y_one_hot * modulating_factor * np.log(probs)

        # Alpha weighting
        if self.alpha is not None:
            if isinstance(self.alpha, (float, int)):
                alpha_weights = np.ones(C) * self.alpha
            else:
                alpha_weights = np.array(self.alpha)
            focal_loss_matrix = focal_loss_matrix * alpha_weights

        loss_per_sample = -np.sum(focal_loss_matrix, axis=-1)
        return float(np.mean(loss_per_sample))

    def gradient(self, y_true: np.ndarray, y_pred_logits: np.ndarray) -> np.ndarray:
        """
        Analytical gradient of Focal Loss with respect to logits z:
        d(FL)/d(z_i) = p_i * (1 - p_t)^gamma - gamma * p_i * (1 - p_t)^(gamma-1) * p_t * log(p_t)
        """
        N, C = y_pred_logits.shape
        if y_true.ndim == 1:
            y_one_hot = np.zeros((N, C), dtype=np.float32)
            y_one_hot[np.arange(N), y_true] = 1.0
        else:
            y_one_hot = y_true

        probs = softmax(y_pred_logits)
        probs = np.clip(probs, self.eps, 1.0 - self.eps)

        # Vectorized analytical gradient calculation:
        # d(FL)/d(z_i) = alpha_t * (p_i - delta_{ti}) * (1 - p_t)^(gamma - 1) * [ (1 - p_t) - gamma * p_t * log(p_t) ]
        p_t = np.sum(probs * y_one_hot, axis=-1, keepdims=True)  # (N, 1)
        p_t = np.clip(p_t, self.eps, 1.0 - self.eps)

        if self.gamma == 0:
            factor = np.ones_like(p_t)
        else:
            term1 = 1.0 - p_t
            term2 = -self.gamma * p_t * np.log(p_t)
            factor = np.power(1.0 - p_t, self.gamma - 1) * (term1 + term2)

        grad = factor * (probs - y_one_hot)

        if self.alpha is not None:
            alpha_weights = np.array(self.alpha) if hasattr(self.alpha, '__len__') else np.ones(C) * self.alpha
            alpha_per_sample = np.sum(y_one_hot * alpha_weights, axis=-1, keepdims=True)
            grad = grad * alpha_per_sample

        return grad / N


class HybridCEFocalLoss:
    """
    Combined Cross-Entropy + Focal Loss:
    L_hybrid = (1 - lambda_weight) * L_CE + lambda_weight * L_FL
    
    Benefits:
    - In early training steps (when weights are random and loss gradients are noisy),
      Cross-Entropy provides steady, smooth directional gradients across all classes.
    - As training progresses, the Focal Loss component (1 - p_t)^gamma aggressively
      down-weights easy on-schedule projects and penalizes hard-to-predict severe delays,
      yielding a significantly superior F1 confidence score on minority delay events.
    """
    def __init__(
        self,
        gamma: float = 2.0,
        alpha: Optional[Union[float, np.ndarray]] = None,
        lambda_weight: float = 0.65,
        from_logits: bool = True,
        eps: float = EPSILON,
    ):
        self.gamma = gamma
        self.alpha = alpha
        self.lambda_weight = lambda_weight
        self.ce_loss = CrossEntropyLoss(from_logits=from_logits, weight=None, eps=eps)
        self.focal_loss = FocalLoss(gamma=gamma, alpha=alpha, from_logits=from_logits, eps=eps)

    def __call__(self, y_true: np.ndarray, y_pred: np.ndarray) -> float:
        l_ce = self.ce_loss(y_true, y_pred)
        l_fl = self.focal_loss(y_true, y_pred)
        return float((1.0 - self.lambda_weight) * l_ce + self.lambda_weight * l_fl)

    def gradient(self, y_true: np.ndarray, y_pred_logits: np.ndarray) -> np.ndarray:
        grad_ce = self.ce_loss.gradient(y_true, y_pred_logits)
        grad_fl = self.focal_loss.gradient(y_true, y_pred_logits)
        return (1.0 - self.lambda_weight) * grad_ce + self.lambda_weight * grad_fl


def compute_class_weights(y: np.ndarray, beta: float = 0.999) -> np.ndarray:
    """
    Computes effective number of samples class weights (Cui et al., CVPR 2019):
    E_n = (1 - beta) / (1 - beta^{N_c})
    Normalizes weights to sum to num_classes.
    """
    classes, counts = np.unique(y, return_counts=True)
    num_classes = len(classes)
    effective_num = 1.0 - np.power(beta, counts)
    weights = (1.0 - beta) / np.array(effective_num, dtype=np.float64)
    # Normalize weights
    weights = weights / np.sum(weights) * num_classes
    return weights
