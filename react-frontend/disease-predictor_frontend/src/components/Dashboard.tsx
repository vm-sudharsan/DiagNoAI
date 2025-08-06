import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Brain, Droplets, User, FileText, Users } from 'lucide-react';
import { authService } from '../services/authService';
import LogoutButton from './LogoutButton';
import NavigationHeader from './NavigationHeader';
import { reportService } from '../services/reportService';

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [testCount, setTestCount] = useState<number>(0);
  const navigate = useNavigate();

  const loadUserData = useCallback(async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);

      // Load test count
      try {
        const count = await reportService.getTestCount();
        setTestCount(count);
      } catch (error) {
        console.error('Failed to load test count:', error);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);



  const diseases = [
    {
      id: 'diabetes',
      name: 'Diabetes Prediction',
      description: 'Analyze risk factors for Type 2 diabetes',
      icon: Droplets,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      borderColor: 'border-orange-200 hover:border-orange-300'
    },
    {
      id: 'heart',
      name: 'Heart Disease Prediction',
      description: 'Assess cardiovascular health risks',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50 hover:bg-red-100',
      borderColor: 'border-red-200 hover:border-red-300'
    },
    {
      id: 'stroke',
      name: 'Stroke Prediction',
      description: 'Evaluate stroke risk factors',
      icon: Activity,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200 hover:border-purple-300'
    },
    {
      id: 'parkinsons',
      name: 'Parkinson\'s Prediction',
      description: 'Analyze neurological indicators',
      icon: Brain,
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-50 hover:bg-green-100',
      borderColor: 'border-green-200 hover:border-green-300'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Navigation Header */}
      <NavigationHeader currentPage="dashboard" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {user?.role === 'RELATIVE' ? 'Family Health Dashboard' : 'Health Assessment Dashboard'}
          </h2>
          <p className="text-gray-600">
            {user?.role === 'RELATIVE'
              ? 'View health reports and assessments from your family members'
              : 'Choose a health condition to assess or view your previous reports'
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className={`grid grid-cols-1 ${user?.role === 'RELATIVE' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6 mb-8`}>
          {/* Only show New Assessment for main users */}
          {user?.role === 'USER' && (
            <button
              onClick={() => navigate('/disease-selection')}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">New Assessment</h3>
                  <p className="text-sm text-gray-600">Start a new health prediction</p>
                </div>
              </div>
            </button>
          )}

          <button
            onClick={() => navigate('/reports')}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 text-left"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {user?.role === 'RELATIVE' ? 'Family Reports' : 'View Reports'}
                </h3>
                <p className="text-sm text-gray-600">
                  {user?.role === 'RELATIVE'
                    ? 'Check family health history and reports'
                    : `Check your test history (${testCount} tests)`
                  }
                </p>
              </div>
            </div>
          </button>

          {/* Only show Manage Family for main users */}
          {user?.role === 'USER' && (
            <button
              onClick={() => navigate('/profile')}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Manage Family</h3>
                  <p className="text-sm text-gray-600">Add or manage relatives</p>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Disease Prediction Cards */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-6">Available Health Assessments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {diseases.map((disease) => {
              const IconComponent = disease.icon;
              return (
                <div
                  key={disease.id}
                  onClick={() => navigate(`/prediction/${disease.id}`)}
                  className={`${disease.bgColor} ${disease.borderColor} border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl group`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${disease.color} rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300 mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h4 className="text-lg font-bold text-gray-800 mb-2">
                      {disease.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {disease.description}
                    </p>
                    
                    <div className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                      Start Assessment →
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
