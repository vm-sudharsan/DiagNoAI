export interface DiabetesData {
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
  age: number;
}

export interface HeartDiseaseData {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
}

export interface StrokeData {
  gender: number;
  age: number;
  hypertension: number;
  heart_disease: number;
  ever_married: number;
  work_type: number;
  residence_type: number;
  avg_glucose_level: number;
  bmi: number;
  smoking_status: number;
}

export interface ParkinsonsData {
  'MDVP:Fo(Hz)': number;
  'MDVP:Fhi(Hz)': number;
  'MDVP:Flo(Hz)': number;
  'MDVP:Jitter(%)': number;
  'MDVP:Jitter(Abs)': number;
  'MDVP:RAP': number;
  'MDVP:PPQ': number;
  'Jitter:DDP': number;
  'MDVP:Shimmer': number;
  'MDVP:Shimmer(dB)': number;
  'Shimmer:APQ3': number;
  'Shimmer:APQ5': number;
  'MDVP:APQ': number;
  'Shimmer:DDA': number;
  NHR: number;
  HNR: number;
  RPDE: number;
  DFA: number;
  spread1: number;
  spread2: number;
  D2: number;
  PPE: number;
}

export type DiseaseType = 'diabetes' | 'heart' | 'stroke' | 'parkinsons';

export interface PredictionResponse {
  prediction: number;
  probability?: number;
  message: string;
}

export interface WeeklyPlan {
  sleepHours: string;
  foodRecommendations: string[];
  workoutTips: string[];
}