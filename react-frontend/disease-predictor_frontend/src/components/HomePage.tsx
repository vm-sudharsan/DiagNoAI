import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Activity, LogIn, UserPlus } from 'lucide-react';
import { authService } from '../services/authService';

const HomePage: React.FC = () => {
  const [name, setName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleNext = () => {
    if (name.trim()) {
      localStorage.setItem('userName', name.trim());
      navigate('/disease-selection');
    }
  };

  const handleAuthenticatedAccess = () => {
    navigate('/dashboard');
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
            DiagNO-AI
            <span className="block text-blue-600">AI-Powered Health Diagnostics</span>
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Get personalized health insights powered by advanced machine learning
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {isAuthenticated ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome back!</h2>
              <p className="text-gray-600 mb-6">Continue to your dashboard to access health assessments</p>
              <button
                onClick={handleAuthenticatedAccess}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
                <ArrowRight size={20} />
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Get Started</h2>
                <p className="text-gray-600">Sign in to access personalized health assessments</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <LogIn size={20} />
                  Sign In
                </button>

                <button
                  onClick={() => navigate('/signup')}
                  className="w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-6 rounded-lg border-2 border-blue-600 transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  <UserPlus size={20} />
                  Create Account
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">Or try without an account</p>
                </div>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter your name for a quick demo
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                  />
                </div>

                {name.trim() && (
                  <button
                    onClick={handleNext}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Try Demo
                    <ArrowRight size={20} />
                  </button>
                )}
              </div>
            </>
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