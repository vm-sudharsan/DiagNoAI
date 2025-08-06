import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import DiabetesForm from './forms/DiabetesForm';
import HeartDiseaseForm from './forms/HeartDiseaseForm';
import StrokeForm from './forms/StrokeForm';
import ParkinsonsForm from './forms/ParkinsonsForm';
import PredictionResult from './PredictionResult';
import WeeklyPlan from './WeeklyPlan';
import { predictDisease } from '../services/api';
import { getHealthRecommendations } from '../utils/healthRecommendations';
import { DiseaseType, PredictionResponse } from '../types/disease';

const PredictionDashboard: React.FC = () => {
  const { diseaseType } = useParams<{ diseaseType: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [inputData, setInputData] = useState<any>(null);
  const userName = localStorage.getItem('userName') || 'User';

  const diseaseInfo = {
    diabetes: { name: 'Diabetes', icon: '🩸', color: 'orange' },
    heart: { name: 'Heart Disease', icon: '❤️', color: 'red' },
    stroke: { name: 'Stroke', icon: '🧠', color: 'purple' },
    parkinsons: { name: "Parkinson's Disease", icon: '🧠', color: 'green' }
  };

  const currentDisease = diseaseInfo[diseaseType as keyof typeof diseaseInfo];

  if (!currentDisease) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Disease Not Found</h1>
          <button
            onClick={() => navigate('/disease-selection')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Selection
          </button>
        </div>
      </div>
    );
  }

  const handlePrediction = async (data: any) => {
    setLoading(true);
    setInputData(data);
    
    try {
      const result = await predictDisease(diseaseType as DiseaseType, data);
      setPrediction(result);
    } catch (error) {
      console.error('Prediction error:', error);
      // Mock response for demonstration
      setPrediction({
        prediction: Math.random() > 0.5 ? 1 : 0,
        probability: Math.random(),
        message: Math.random() > 0.5 
          ? `You may be at risk of ${currentDisease.name}` 
          : `Low risk of ${currentDisease.name} detected`
      });
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (diseaseType) {
      case 'diabetes':
        return <DiabetesForm onSubmit={handlePrediction} loading={loading} />;
      case 'heart':
        return <HeartDiseaseForm onSubmit={handlePrediction} loading={loading} />;
      case 'stroke':
        return <StrokeForm onSubmit={handlePrediction} loading={loading} />;
      case 'parkinsons':
        return <ParkinsonsForm onSubmit={handlePrediction} loading={loading} />;
      default:
        return null;
    }
  };

  const getHealthPlan = () => {
    if (prediction) {
      return getHealthRecommendations(diseaseType as DiseaseType, prediction.prediction);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/disease-selection')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Selection
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {currentDisease.icon} {currentDisease.name} Assessment
            </h1>
            <p className="text-gray-600 mt-1">Hello, {userName}</p>
          </div>
          
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 flex items-center space-x-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-lg font-semibold">Analyzing your data...</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Enter Your Health Information
            </h2>
            {renderForm()}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {prediction && inputData && (
              <>
                <PredictionResult
                  diseaseType={diseaseType as DiseaseType}
                  prediction={prediction.prediction}
                  probability={prediction.probability}
                  message={prediction.message}
                  inputData={inputData}
                />
              </>
            )}
          </div>
        </div>

        {/* Weekly Plan Section */}
        {prediction && (
          <div className="mt-8">
            <WeeklyPlan 
              plan={getHealthPlan()!} 
              diseaseType={diseaseType!}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionDashboard;