import axios from 'axios';
import { DiabetesData, HeartDiseaseData, StrokeData, ParkinsonsData, PredictionResponse, DiseaseType } from '../types/disease';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictDisease = async (
  diseaseType: DiseaseType,
  data: DiabetesData | HeartDiseaseData | StrokeData | ParkinsonsData
): Promise<PredictionResponse> => {
  try {
    const response = await api.post(`/predict/${diseaseType}`, data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to get prediction. Please try again.');
  }
};

export default api;