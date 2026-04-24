import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activity_type: "",
    weight_category: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: Number(formData.age),
          gender: formData.gender,
          height: Number(formData.height),
          weight: Number(formData.weight),
          activity_type: formData.activity_type,
          weight_category: formData.weight_category,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>🥗 AI Diet Recommendation</h1>

      <div className="form">
        <input name="age" placeholder="Age" onChange={handleChange} />

        <select name="gender" onChange={handleChange}>
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input name="height" placeholder="Height (cm)" onChange={handleChange} />
        <input name="weight" placeholder="Weight (kg)" onChange={handleChange} />

        <select name="activity_type" onChange={handleChange}>
          <option value="">Activity Type</option>
          <option value="Walking">Walking</option>
          <option value="Running">Running</option>
          <option value="Cycling">Cycling</option>
          <option value="Gym">Gym</option>
          <option value="HIIT">HIIT</option>
          <option value="Yoga">Yoga</option>
        </select>

        <select name="weight_category" onChange={handleChange}>
          <option value="">Weight Category</option>
          <option value="Underweight">Underweight</option>
          <option value="Normal">Normal</option>
          <option value="Overweight">Overweight</option>
          <option value="Obese">Obese</option>
        </select>

        <button onClick={handleSubmit}>Predict</button>
      </div>

      {result && (
        <div className="result">
          <h2>Results</h2>
          <p><b>BMI:</b> {result.bmi}</p>
          <p><b>BMR:</b> {result.bmr}</p>
          <p><b>Calories:</b> {result.calories}</p>
          <p><b>Gender:</b> {result.gender_label}</p>
          <p><b>Activity Type:</b> {result.activity_label}</p>
          <p><b>Weight Category:</b> {result.weight_category_label}</p>
          <p><b>Protein:</b> {result.protein} g</p>
          <p><b>Carbs:</b> {result.carbs} g</p>
          <p><b>Fats:</b> {result.fats} g</p>

          <h3>Diet Plan</h3>
          <ul>
            {result.meals?.map((item, index) => (
              <li key={index}>
                {item.name} - {item.calories} kcal
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
