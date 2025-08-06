import axios from 'axios';
import { DiabetesData, HeartDiseaseData, StrokeData, ParkinsonsData, PredictionResponse, DiseaseType } from '../types/disease';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const predictDisease = async (
  diseaseType: DiseaseType,
  data: DiabetesData | HeartDiseaseData | StrokeData | ParkinsonsData
): Promise<PredictionResponse> => {
  try {
    const response = await api.post(`/predict/${diseaseType}`, data);
    return response.data;
  } catch (error: unknown) {
    console.error('API Error:', error);
    throw new Error('Failed to get prediction. Please try again.');
  }
};

export default api;