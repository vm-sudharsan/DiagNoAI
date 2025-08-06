import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

interface LoginResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

interface SignupData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  gender?: string;
  age?: number;
  medicalHistory?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  phoneNumber?: string;
  gender?: string;
  age?: number;
}

class AuthService {
  private tokenKey = 'authToken';
  private userKey = 'currentUser';

  async login(username: string, password: string, role: string = 'USER'): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        username,
        password,
        role
      });

      const data = response.data;
      
      // Store token and user info
      localStorage.setItem(this.tokenKey, data.token);
      localStorage.setItem(this.userKey, JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        role: data.role
      }));

      // Set default authorization header
      this.setAuthHeader(data.token);

      return data;
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Login failed'
        : 'Login failed';
      throw new Error(errorMessage);
    }
  }

  async signup(signupData: SignupData): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, signupData);
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Signup failed'
        : 'Signup failed';
      throw new Error(errorMessage);
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    delete axios.defaults.headers.common['Authorization'];
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  setAuthHeader(token: string): void {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      this.setAuthHeader(token);
    }
  }

  async getUserProfile(): Promise<User> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/profile`);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to fetch profile'
        : 'Failed to fetch profile';
      throw new Error(errorMessage);
    }
  }

  async addRelative(relativeData: SignupData & { relationship?: string }): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/add-relative`, relativeData);
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to add relative'
        : 'Failed to add relative';
      throw new Error(errorMessage);
    }
  }

  async getRelatives(): Promise<User[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/relatives`);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to fetch relatives'
        : 'Failed to fetch relatives';
      throw new Error(errorMessage);
    }
  }

  async removeRelative(relativeId: number): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/users/relatives/${relativeId}/remove`);
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to remove relative'
        : 'Failed to remove relative';
      throw new Error(errorMessage);
    }
  }
}

export const authService = new AuthService();

// Initialize auth on app start
authService.initializeAuth();
