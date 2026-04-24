from pathlib import Path
import pickle

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split


BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "users_dataset.csv"
MODEL_PATH = BASE_DIR / "diet_model.pkl"

# Load dataset
df = pd.read_csv(DATASET_PATH).dropna()

# Feature engineering
df["height_m"] = df["height"] / 100
df["bmi"] = df["weight"] / (df["height_m"] ** 2)

# Features and target
feature_columns = [
    "age",
    "gender",
    "height",
    "weight",
    "activity_type",
    "weight_category",
    "bmi",
]
X = pd.get_dummies(df[feature_columns], drop_first=False)
y = df["calories"]

# 🔹 Train-Test Split (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 🔹 Evaluate Model
accuracy = model.score(X_test, y_test)
print("Model Accuracy:", round(accuracy, 2))

# Save model and feature schema for inference-time alignment
with open(MODEL_PATH, "wb") as model_file:
    pickle.dump(
        {
            "model": model,
            "feature_columns": X.columns.tolist(),
        },
        model_file,
    )

print("Model trained and saved successfully!")
