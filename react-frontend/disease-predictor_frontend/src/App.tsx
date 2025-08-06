import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import HomePage from './components/HomePage';
import DiseaseSelection from './components/DiseaseSelection';
import PredictionDashboard from './components/PredictionDashboard';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/Dashboard';
import UserProfile from './components/auth/UserProfile';
import TestReports from './components/TestReports';
import AddRelative from './components/AddRelative';
import ProtectedRoute from './components/ProtectedRoute.tsx';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><TestReports /></ProtectedRoute>} />
          <Route path="/add-relative" element={<ProtectedRoute><AddRelative /></ProtectedRoute>} />
          <Route path="/disease-selection" element={<ProtectedRoute><DiseaseSelection /></ProtectedRoute>} />
          <Route path="/prediction/:diseaseType" element={<ProtectedRoute><PredictionDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;