import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Activity } from 'lucide-react';

const HomePage: React.FC = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (name.trim()) {
      localStorage.setItem('userName', name.trim());
      navigate('/disease-selection');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Floating medical icons */}
        <div className="absolute top-20 left-20 text-blue-200 animate-pulse">
          <Heart size={32} />
        </div>
        <div className="absolute top-32 right-32 text-teal-200 animate-pulse delay-1000">
          <Activity size={28} />
        </div>
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Heart className="w-10 h-10 text-blue-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            Multiple Disease
            <span className="block text-blue-600">Predictor Application</span>
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Get personalized health insights powered by advanced machine learning
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
              Enter your name to get started
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleNext()}
            />
          </div>

          {name.trim() && (
            <button
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight size={20} />
            </button>
          )}
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Secure • Private • Accurate Predictions</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;