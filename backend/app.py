from pathlib import Path
import pickle

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "diet_model.pkl"
FOOD_DATASET_PATH = BASE_DIR / "diet_dataset.csv"

with open(MODEL_PATH, "rb") as model_file:
    model_bundle = pickle.load(model_file)

model = model_bundle["model"]
feature_columns = model_bundle["feature_columns"]
food_df = pd.read_csv(FOOD_DATASET_PATH)

# BMI
def calculate_bmi(weight, height):
    height_m = height / 100
    return round(weight / (height_m ** 2), 2)

# BMR
def calculate_bmr(age, gender, weight, height):
    if str(gender).lower() == "male":
        return 10 * weight + 6.25 * height - 5 * age + 5
    return 10 * weight + 6.25 * height - 5 * age - 161


def infer_weight_category(bmi):
    if bmi < 18.5:
        return "Underweight"
    if bmi < 25:
        return "Normal"
    if bmi < 30:
        return "Overweight"
    return "Obese"


def adjust_calories_for_goal(calories, goal):
    goal_key = str(goal).strip().lower()
    if goal_key == "weight loss":
        return calories - 400
    if goal_key == "weight gain":
        return calories + 300
    return calories


def build_feature_frame(age, gender, height, weight, activity_type, weight_category, bmi):
    row = pd.DataFrame(
        [
            {
                "age": age,
                "gender": gender,
                "height": height,
                "weight": weight,
                "activity_type": activity_type,
                "weight_category": weight_category,
                "bmi": bmi,
            }
        ]
    )

    encoded = pd.get_dummies(row, drop_first=False)
    return encoded.reindex(columns=feature_columns, fill_value=0)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        age = float(data["age"])
        gender = str(data["gender"])
        height = float(data["height"])
        weight = float(data["weight"])
        goal = str(data["goal"])

        bmi = calculate_bmi(weight, height)
        bmr = calculate_bmr(age, gender, weight, height)
        weight_category = infer_weight_category(bmi)
        activity_type = "Walking"

        features = build_feature_frame(
            age,
            gender,
            height,
            weight,
            activity_type,
            weight_category,
            bmi,
        )
        base_calories = model.predict(features)[0]
        calories = adjust_calories_for_goal(base_calories, goal)

        # Macronutrients
        protein = round(weight * 1.5)
        carbs = round(calories * 0.5 / 4)
        fats = round(calories * 0.25 / 9)

        # Meals
        meals = [
            {"name":"Breakfast","calories": round(calories*0.3)},
            {"name":"Lunch","calories": round(calories*0.4)},
            {"name":"Dinner","calories": round(calories*0.3)}
        ]

        return jsonify({
            "bmi": bmi,
            "bmr": round(bmr, 2),
            "calories": round(calories, 2),
            "protein": protein,
            "carbs": carbs,
            "fats": fats,
            "gender_label": gender,
            "activity_label": activity_type,
            "weight_category_label": weight_category,
            "goal_label": goal,
            "target_weight": weight,
            "target_weight_inferred": False,
            "meals": meals,
            "matched_profiles": df_to_sample(),
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def df_to_sample():
    sample = [
        {"age": 25, "weight": 70, "goal": "Weight Loss", "gender": "Male", "calories": 2000},
        {"age": 30, "weight": 80, "goal": "Weight Gain", "gender": "Male", "calories": 2800},
    ]
    return sample


if __name__ == '__main__':
    app.run(debug=True)
