"""
Comprehensive evaluation metrics and F1 confidence score optimization
"""

import numpy as np
from typing import Dict, Any, List, Tuple, Optional


def confusion_matrix(y_true: np.ndarray, y_pred: np.ndarray, num_classes: int) -> np.ndarray:
    """
    Computes confusion matrix where rows are actual classes and columns are predictions.
    """
    cm = np.zeros((num_classes, num_classes), dtype=int)
    for t, p in zip(y_true, y_pred):
        if 0 <= t < num_classes and 0 <= p < num_classes:
            cm[t, p] += 1
    return cm


def compute_classification_metrics(
    y_true: np.ndarray,
    y_pred_probs: np.ndarray,
    class_names: List[str],
    y_pred: Optional[np.ndarray] = None,
) -> Dict[str, Any]:
    """
    Computes precision, recall, F1 per class, macro F1, weighted F1, and overall accuracy.
    """
    num_classes = len(class_names)
    if y_pred is None:
        y_pred = np.argmax(y_pred_probs, axis=-1)
    cm = confusion_matrix(y_true, y_pred, num_classes)

    per_class = {}
    f1_scores = []
    weights = []

    total_samples = len(y_true)
    accuracy = float(np.sum(np.diag(cm)) / max(1, total_samples))

    for c in range(num_classes):
        tp = float(cm[c, c])
        fp = float(np.sum(cm[:, c]) - tp)
        fn = float(np.sum(cm[c, :]) - tp)
        tn = float(total_samples - (tp + fp + fn))

        precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = (2.0 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
        support = int(np.sum(cm[c, :]))

        per_class[class_names[c]] = {
            'precision': round(precision, 4),
            'recall': round(recall, 4),
            'f1': round(f1, 4),
            'support': support,
            'tp': int(tp),
            'fp': int(fp),
            'fn': int(fn),
        }
        f1_scores.append(f1)
        weights.append(support)

    macro_f1 = float(np.mean(f1_scores))
    weighted_f1 = float(np.average(f1_scores, weights=weights)) if sum(weights) > 0 else 0.0

    # Calculate mean prediction confidence (max predicted probability)
    max_probs = np.max(y_pred_probs, axis=-1)
    mean_confidence = float(np.mean(max_probs))

    # Composite F1 Confidence Score: combines weighted F1 with calibrated prediction certainty
    f1_confidence_score = float(0.7 * weighted_f1 + 0.3 * mean_confidence)

    return {
        'accuracy': round(accuracy, 4),
        'macro_f1': round(macro_f1, 4),
        'weighted_f1': round(weighted_f1, 4),
        'mean_confidence': round(mean_confidence, 4),
        'f1_confidence_score': round(f1_confidence_score, 4),
        'f1_confidence_pct': round(f1_confidence_score * 100, 1),
        'per_class': per_class,
        'confusion_matrix': cm.tolist(),
        'class_names': class_names,
    }


def sweep_decision_thresholds(y_true: np.ndarray, y_probs: np.ndarray, target_class_idx: int = 1) -> List[Dict[str, Any]]:
    """
    Sweeps decision threshold tau in [0.05, 0.95] to analyze Precision-Recall-F1 trade-offs
    and find the optimal operating threshold that maximizes minority class F1.
    """
    thresholds = np.linspace(0.05, 0.95, 19)
    results = []

    y_binary = (y_true == target_class_idx).astype(int)
    probs_target = y_probs[:, target_class_idx] if y_probs.ndim == 2 else y_probs

    for tau in thresholds:
        preds = (probs_target >= tau).astype(int)
        tp = np.sum((preds == 1) & (y_binary == 1))
        fp = np.sum((preds == 1) & (y_binary == 0))
        fn = np.sum((preds == 0) & (y_binary == 1))

        prec = tp / (tp + fp) if (tp + fp) > 0 else 1.0
        rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = (2 * prec * rec) / (prec + rec) if (prec + rec) > 0 else 0.0

        results.append({
            'threshold': round(float(tau), 2),
            'precision': round(float(prec), 4),
            'recall': round(float(rec), 4),
            'f1': round(float(f1), 4),
        })

    return results
