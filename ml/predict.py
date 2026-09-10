import sys
import json
import joblib
import numpy as np
import os
import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--features', type=str, help='JSON string of features')
    args, unknown = parser.parse_known_args()

    input_data = None
    if args.features:
        input_data = json.loads(args.features)
    else:
        # read from stdin
        stdin_content = sys.stdin.read().strip()
        if stdin_content:
            try:
                input_data = json.loads(stdin_content)
                if 'features' in input_data:
                    input_data = input_data['features']
            except json.JSONDecodeError:
                print(json.dumps({"error": "Invalid JSON input"}))
                return
    
    if not input_data:
        print(json.dumps({"error": "No input provided"}))
        return

    model_path = os.path.join(os.path.dirname(__file__), 'trained_ensemble.joblib')
    if not os.path.exists(model_path):
        print(json.dumps({"error": f"Model not found at {model_path}"}))
        return

    checkpoint = joblib.load(model_path)
    ensemble_rf = checkpoint['ensemble_rf']
    scaler = checkpoint['scaler']
    feature_names = checkpoint['feature_names']
    best_threshold = checkpoint.get('best_threshold', 0.5)

    num_features = scaler.mean_.shape[0]

    # build feature vector
    x_raw = np.zeros((1, len(feature_names)), dtype=np.float32)

    for i, fname in enumerate(feature_names):
        if i < num_features:
            # Numerical feature
            if fname in input_data:
                x_raw[0, i] = float(input_data[fname])
            else:
                x_raw[0, i] = scaler.mean_[i]
        else:
            # Categorical feature (one-hot)
            if fname.startswith('sec_') and 'sector' in input_data:
                if input_data['sector'] == fname[4:]:
                    x_raw[0, i] = 1.0
            elif fname.startswith('reg_') and 'region' in input_data:
                if input_data['region'] == fname[4:]:
                    x_raw[0, i] = 1.0
            else:
                if fname in input_data:
                    x_raw[0, i] = float(input_data[fname])
                else:
                    x_raw[0, i] = 0.0

    # scale numerical features
    x_num_scaled = scaler.transform(x_raw[:, :num_features])
    x_input = np.hstack([x_num_scaled, x_raw[:, num_features:]])

    probs = ensemble_rf.predict_proba(x_input)[0]
    
    pred_class = int(np.argmax(probs))
    if len(probs) > 2 and probs[2] >= best_threshold:
        pred_class = 2

    class_names = ['On-Track', 'At-Risk', 'Severe-Delayed']
    class_name = class_names[pred_class]
    confidence = float(probs[pred_class])

    output = {
        "predictedClass": pred_class,
        "className": class_name,
        "probabilities": [float(p) for p in probs],
        "confidence": confidence,
        "riskLevel": "High" if pred_class == 2 else ("Medium" if pred_class == 1 else "Low")
    }

    print(json.dumps(output))

if __name__ == '__main__':
    main()
