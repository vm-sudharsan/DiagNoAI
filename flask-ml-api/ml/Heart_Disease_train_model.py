# ml/train_heart.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier
import joblib
import os

# Load dataset
df = pd.read_csv('datasets/heart_disease_data.csv')

# Split into features and target
X = df.drop('target', axis=1)  # Adjust 'target' if your label column is named differently
y = df['target']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train XGBoost model
model = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Heart Disease Model Accuracy: {acc * 100:.2f}%")

# Save model
os.makedirs("model", exist_ok=True)
joblib.dump(model, 'models/heart_model.pkl')
