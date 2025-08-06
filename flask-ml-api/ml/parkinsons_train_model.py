# ml/train_parkinsons.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier
import joblib
import os

# Load dataset
df = pd.read_csv('datasets/parkinsons.csv')

# Drop the name column
df = df.drop(['name'], axis=1)

# Features and target
X = df.drop('status', axis=1)
y = df['status']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
model.fit(X_train, y_train)

# Accuracy
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Parkinson’s Model Accuracy: {acc * 100:.2f}%")

# Save model
os.makedirs("model", exist_ok=True)
joblib.dump(model, 'models/parkinsons_model.pkl')
