# Diet Recommendation System 🥗

An AI-powered diet recommendation system that provides personalized meal suggestions based on user data such as age, weight, and fitness goals (weight loss, weight gain, or maintenance). The system uses a trained machine learning model and a nutrition dataset to generate recommendations.

## 🚀 Features

* Personalized diet recommendations using Machine Learning
* Supports weight loss, weight gain, and maintenance goals
* Modern and interactive UI built with React
* Backend API using Flask
* Uses real dataset for food nutrition analysis

## 🛠️ Technologies Used

### Frontend:

* React.js (Vite)
* HTML, CSS, JavaScript

### Backend:

* Python
* Flask

### Machine Learning:

* Scikit-learn (Model Training)
* Pandas, NumPy

### Data:

* CSV datasets (diet_dataset.csv, users_dataset.csv)
* Trained model file (diet_model.pkl)

## 📌 Project Structure

diet-recommendation-system/
│── frontend/ (React + Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│
│── backend/
│   ├── app.py
│   ├── train_model.py
│   ├── diet_model.pkl
│   ├── diet_dataset.csv
│   ├── users_dataset.csv
│   ├── requirements.txt
│
│── README.md

## ▶️ How to Run

### 🔹 Backend Setup

cd backend
pip install -r requirements.txt
python app.py

### 🔹 Frontend Setup

cd frontend
npm install
npm run dev

Then open the local development URL in your browser.

## 🤖 How it Works

* User enters details (age, weight, goal)
* Frontend sends data to Flask backend
* ML model processes input
* System returns personalized diet plan

## 📷 Output

### Home
![Home](https://github.com/user-attachments/assets/a75b49a7-ad8a-4279-8c4e-01a224e3bb52)

### Output
![Output](https://github.com/user-attachments/assets/544f5ca1-22b2-4a6f-833e-6f998670825a)

## 👨‍💻 Author

Abhinav Vashistha

## ⚠️ Note
Trained model is not included due to size limitations.  
Run train_model.py to generate the model.
