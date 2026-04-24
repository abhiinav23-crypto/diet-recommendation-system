import { useState } from "react";
import "./diet.css";

const initialFormData = {
  age: "",
  gender: "",
  height: "",
  weight: "",
  goal: "",
};

function DietApp() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recommendation.");
      }

      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Dataset-powered diet API</p>
          <h1>Diet recommendation system</h1>
          <p className="hero-text">
            Enter a user profile and get calorie, protein, carbs, and fat
            targets matched from your CSV dataset.
          </p>
        </div>

        <form className="diet-form" onSubmit={handleSubmit}>
          <label>
            <span>Age</span>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="22"
            />
          </label>

          <label>
            <span>Gender</span>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>

          <label>
            <span>Height (cm)</span>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="175"
            />
          </label>

          <label>
            <span>Current weight (kg)</span>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="70"
            />
          </label>

          <label className="full-width">
            <span>Goal</span>
            <select name="goal" value={formData.goal} onChange={handleChange}>
              <option value="">Select goal</option>
              <option value="Weight Loss">Weight loss</option>
              <option value="Weight Gain">Weight gain</option>
              <option value="Maintain Weight">Maintain weight</option>
            </select>
          </label>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Generating plan..." : "Get diet recommendation"}
          </button>
        </form>

        {error ? <p className="status error">{error}</p> : null}

        {result ? (
          <section className="results">
            <div className="result-header">
              <div>
                <p className="eyebrow">Recommended macros</p>
                <h2>Daily nutrition target</h2>
              </div>
              <p className="summary">
                {result.gender_label} | {result.goal_label} | BMI {result.bmi}
              </p>
            </div>

            <div className="macro-grid">
              <article>
                <span>Calories</span>
                <strong>{result.calories}</strong>
              </article>
              <article>
                <span>Protein</span>
                <strong>{result.protein}g</strong>
              </article>
              <article>
                <span>Carbs</span>
                <strong>{result.carbs}g</strong>
              </article>
              <article>
                <span>Fats</span>
                <strong>{result.fats}g</strong>
              </article>
            </div>

            <div className="detail-grid">
              <article className="info-card">
                <h3>Goal</h3>
                <p>{result.goal_label}</p>
              </article>

              <article className="info-card">
                <h3>Meal split</h3>
                <ul>
                  {result.meals.map((meal) => (
                    <li key={meal.name}>
                      {meal.name}: {meal.calories} kcal
                    </li>
                  ))}
                </ul>
              </article>

              <article className="info-card full-span">
                <h3>Closest dataset matches</h3>
                <ul>
                  {result.matched_profiles.map((profile, index) => (
                    <li key={`${profile.age}-${profile.weight}-${index}`}>
                      {profile.gender} | {profile.weight} kg |{" "}
                      {profile.calories} kcal
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}

export default DietApp;
