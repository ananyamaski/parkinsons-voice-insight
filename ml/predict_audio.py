import os
import joblib
import pandas as pd

from feature_extractor import extract_features


# =========================================================
# PATHS
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "parkinsons_svm.pkl"
)

AUDIO_PATH = os.path.join(
    BASE_DIR,
    "data",
    "sample_audio",
    "test_voice.wav"
)


# =========================================================
# LOAD MODEL
# =========================================================

print("Loading SVM model...")

saved_model = joblib.load(
    MODEL_PATH
)

model = saved_model["model"]

feature_names = saved_model["features"]


# =========================================================
# EXTRACT FEATURES
# =========================================================

print("\nExtracting voice features...")

features = extract_features(
    AUDIO_PATH
)


# =========================================================
# CREATE DATAFRAME
# =========================================================

X = pd.DataFrame(
    [features],
    columns=feature_names
)


print(
    f"\nFeatures extracted: {len(features)}"
)


# =========================================================
# PREDICTION
# =========================================================

prediction = model.predict(X)[0]


# =========================================================
# PROBABILITY
# =========================================================

probabilities = model.predict_proba(X)[0]

confidence = max(probabilities) * 100


# =========================================================
# DISPLAY RESULT
# =========================================================

print("\n" + "=" * 55)

print("VOICE ANALYSIS RESULT")

print("=" * 55)

print(
    f"\nPredicted class: {prediction}"
)

print(
    f"Confidence: {confidence:.2f}%"
)


if prediction == 1:

    print(
        "\nAssessment: Higher risk indicator"
    )

else:

    print(
        "\nAssessment: Lower risk indicator"
    )


print("\nAnalysis completed successfully.")