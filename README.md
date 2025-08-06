# 🧠 MediPredict: AI-Based Multi-Disease Predictor

A full-stack machine learning web application that predicts the likelihood of multiple diseases — including Diabetes, Heart Disease, Stroke, and Parkinson’s — using trained ML models.

Built using:
- React for the frontend
- Spring Boot for the backend API
- Flask for serving the machine learning models

---

## 🚀 Live Demo

- Application : https://frontend-tau-navy-82.vercel.app/


---

## 🛠 Tech Stack

| Layer     | Technologies                           |
|-----------|----------------------------------------|
| Frontend  | React, JavaScript, HTML, CSS           |
| Backend   | Spring Boot (Java), RestTemplate       |
| ML API    | Flask, Python, XGBoost, Scikit-learn   |
| Deployment| Render (Flask & Spring Boot), Netlify (React) |

---

## 📁 Project Structure

multi-disease-predictor/
├── flask-ml-api/           ← ML models + Flask routes  
├── springboot-backend/     ← Spring Boot controller  
├── react-frontend/         ← Frontend built in React  
└── README.md



---

## 🧠 Diseases & Models

| Disease      | Model               | Accuracy |
|--------------|---------------------|----------|
| Diabetes     | XGBoost Classifier  | 82.5%    |
| Heart        | XGBoost Classifier  | 87.1%    |
| Stroke       | XGBoost Classifier  | 88.2%    |
| Parkinson’s  | XGBoost Classifier  | 92.6%    |

Each model was trained using real-world healthcare datasets and tuned for optimal performance.

---

## ⚙️ How It Works

1. User opens the frontend (React)
2. Chooses a disease to predict
3. Inputs medical values based on dataset features
4. React sends the request to Spring Boot backend
5. Spring Boot forwards the request to the appropriate Flask route
6. Flask returns the ML prediction
7. Frontend displays:
   - Prediction result
   - Graphs based on input data
   - Personalized weekly health tips

---

## 📈 Features

- 🔄 Multi-disease selector
- 📊 Dynamic charts (after prediction)
- 🩺 Personalized health suggestions:
  - Recommended sleep hours
  - Diet advice
  - Workout plans

---

## 🧪 How to Run Locally

```bash
# 1. Clone this repo:
git clone https://github.com/Vivek2k29/Multi-Disease-Predictor.git
cd Multi-Disease-Predictor

# 2. Start Flask ML API
cd flask-ml-api
pip install -r requirements.txt
python app.py

# 3. Start Spring Boot backend
cd ../springboot-backend
mvn spring-boot:run

# 4. Start React frontend
cd ../react-frontend
npm install
npm run dev







