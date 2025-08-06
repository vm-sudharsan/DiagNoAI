import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Brain, Droplets, Activity, ArrowRight } from 'lucide-react';

const DiseaseSelection: React.FC = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  const diseases = [
    {
      id: 'diabetes',
      name: 'Predict Diabetes',
      description: 'Analyze risk factors for Type 2 diabetes',
      icon: Droplets,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      borderColor: 'border-orange-200 hover:border-orange-300'
    },
    {
      id: 'heart',
      name: 'Predict Heart Disease',
      description: 'Assess cardiovascular health risks',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50 hover:bg-red-100',
      borderColor: 'border-red-200 hover:border-red-300'
    },
    {
      id: 'stroke',
      name: 'Predict Stroke',
      description: 'Evaluate stroke risk factors',
      icon: Activity,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200 hover:border-purple-300'
    },
    {
      id: 'parkinsons',
      name: 'Predict Parkinson\'s',
      description: 'Analyze neurological indicators',
      icon: Brain,
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-50 hover:bg-green-100',
      borderColor: 'border-green-200 hover:border-green-300'
    }
  ];

  const handleDiseaseSelect = (diseaseId: string) => {
    navigate(`/prediction/${diseaseId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Welcome back, <span className="text-blue-600">{userName}</span>!
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
            Select a Disease to Predict
          </h2>
          <p className="text-gray-600">
            Choose the health condition you'd like to assess
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {diseases.map((disease) => {
            const IconComponent = disease.icon;
            return (
              <div
                key={disease.id}
                onClick={() => handleDiseaseSelect(disease.id)}
                className={`${disease.bgColor} ${disease.borderColor} border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${disease.color} rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {disease.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {disease.description}
                </p>
                
                <div className="flex items-center text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  Start Assessment
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiseaseSelection;