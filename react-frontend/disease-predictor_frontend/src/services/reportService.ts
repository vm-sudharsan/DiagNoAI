import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

export interface TestReport {
  id: number;
  diseaseType: string;
  predictionResult: number;
  probability?: number;
  inputData: string;
  predictionMessage: string;
  createdAt: string;
  userName: string;
  userEmail: string;
}

const reportApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
reportApi.interceptors.request.use(
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

export const reportService = {
  // Get user's own test reports
  async getMyReports(): Promise<TestReport[]> {
    try {
      const response = await reportApi.get('/reports/my-reports');
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Failed to fetch reports'
        : 'Failed to fetch reports';
      throw new Error(errorMessage);
    }
  },

  // Get accessible reports (user's own + relatives')
  async getAccessibleReports(): Promise<TestReport[]> {
    try {
      const response = await reportApi.get('/reports/accessible-reports');
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Failed to fetch accessible reports'
        : 'Failed to fetch accessible reports';
      throw new Error(errorMessage);
    }
  },

  // Get reports by disease type
  async getReportsByDisease(diseaseType: string): Promise<TestReport[]> {
    try {
      const response = await reportApi.get(`/reports/by-disease/${diseaseType}`);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Failed to fetch reports by disease'
        : 'Failed to fetch reports by disease';
      throw new Error(errorMessage);
    }
  },

  // Get specific report by ID
  async getReportById(reportId: number): Promise<TestReport> {
    try {
      const response = await reportApi.get(`/reports/${reportId}`);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Failed to fetch report'
        : 'Failed to fetch report';
      throw new Error(errorMessage);
    }
  },

  // Get test count
  async getTestCount(): Promise<number> {
    try {
      const response = await reportApi.get('/reports/stats/count');
      return response.data.count;
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to fetch test count'
        : 'Failed to fetch test count';
      throw new Error(errorMessage);
    }
  },

  // Save a manual test report
  async saveReport(reportData: {
    diseaseType: string;
    predictionResult: number;
    probability?: number;
    inputData: string;
    predictionMessage: string;
  }): Promise<TestReport> {
    try {
      const response = await reportApi.post('/reports/save', reportData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to save report'
        : 'Failed to save report';
      throw new Error(errorMessage);
    }
  }
};

export default reportService;
