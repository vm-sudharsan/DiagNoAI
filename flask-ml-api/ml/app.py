
from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load models
diabetes_model = joblib.load('models/diabetes_model.pkl')
heart_model = joblib.load('models/heart_model.pkl')
stroke_model = joblib.load('models/stroke_model.pkl')
parkinsons_model = joblib.load('models/parkinsons_model.pkl')

@app.route('/predict/parkinsons', methods=['POST'])
def predict_parkinsons():
    data = request.get_json()

    # Extract all required features in correct order
    features = np.array([
        data['MDVP:Fo(Hz)'], data['MDVP:Fhi(Hz)'], data['MDVP:Flo(Hz)'],
        data['MDVP:Jitter(%)'], data['MDVP:Jitter(Abs)'], data['MDVP:RAP'],
        data['MDVP:PPQ'], data['Jitter:DDP'], data['MDVP:Shimmer'],
        data['MDVP:Shimmer(dB)'], data['Shimmer:APQ3'], data['Shimmer:APQ5'],
        data['MDVP:APQ'], data['Shimmer:DDA'], data['NHR'], data['HNR'],
        data['RPDE'], data['DFA'], data['spread1'], data['spread2'],
        data['D2'], data['PPE']
    ]).reshape(1, -1)

    prediction = parkinsons_model.predict(features)[0]
    return jsonify({'prediction': int(prediction)})




@app.route('/predict/stroke', methods=['POST'])
def predict_stroke():
    data = request.get_json()

    # Encode inputs manually (based on LabelEncoder mapping from train script)
    gender = {'Male': 1, 'Female': 0, 'Other': 2}[data['gender']]
    ever_married = {'Yes': 1, 'No': 0}[data['ever_married']]
    work_type_map = {'Private': 2, 'Self-employed': 3, 'Govt_job': 0, 'children': 1, 'Never_worked': 4}
    work_type = work_type_map[data['work_type']]
    residence_type = {'Urban': 1, 'Rural': 0}[data['Residence_type']]
    smoking_status_map = {'never smoked': 1, 'formerly smoked': 0, 'smokes': 2, 'Unknown': 3}
    smoking_status = smoking_status_map[data['smoking_status']]

    # Feature order must match training
    features = np.array([
        gender,
        data['age'],
        data['hypertension'],
        data['heart_disease'],
        ever_married,
        work_type,
        residence_type,
        data['avg_glucose_level'],
        data['bmi'],
        smoking_status
    ]).reshape(1, -1)

    prediction = stroke_model.predict(features)[0]
    return jsonify({'prediction': int(prediction)})


@app.route('/')
def home():
    return "Welcome to Multi-Disease Prediction API (Diabetes & Heart Supported)"

@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    data = request.get_json()
    features = np.array([
        data['Pregnancies'], data['Glucose'], data['BloodPressure'],
        data['SkinThickness'], data['Insulin'], data['BMI'],
        data['DiabetesPedigreeFunction'], data['Age']
    ]).reshape(1, -1)
    prediction = diabetes_model.predict(features)[0]
    return jsonify({'prediction': int(prediction)})

@app.route('/predict/heart', methods=['POST'])
def predict_heart():
    data = request.get_json()

    # Extract features (based on your dataset columns)
    features = np.array([
        data['age'], data['sex'], data['cp'], data['trestbps'], data['chol'],
        data['fbs'], data['restecg'], data['thalach'], data['exang'],
        data['oldpeak'], data['slope'], data['ca'], data['thal']
    ]).reshape(1, -1)

    prediction = heart_model.predict(features)[0]
    return jsonify({'prediction': int(prediction)})

if __name__ == '__main__':
    app.run(debug=True)
