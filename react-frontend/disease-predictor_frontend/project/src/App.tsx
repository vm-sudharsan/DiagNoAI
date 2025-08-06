import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import DiseaseSelection from './components/DiseaseSelection';
import PredictionDashboard from './components/PredictionDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/disease-selection" element={<DiseaseSelection />} />
          <Route path="/prediction/:diseaseType" element={<PredictionDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;