import React from 'react';
import { Calendar, Moon, Utensils, Dumbbell, CheckCircle } from 'lucide-react';
import { WeeklyPlan as WeeklyPlanType } from '../types/disease';

interface WeeklyPlanProps {
  plan: WeeklyPlanType;
  diseaseType: string;
}

const WeeklyPlan: React.FC<WeeklyPlanProps> = ({ plan, diseaseType }) => {
  const diseaseColors = {
    diabetes: 'from-orange-500 to-red-500',
    heart: 'from-red-500 to-pink-500',
    stroke: 'from-purple-500 to-indigo-500',
    parkinsons: 'from-green-500 to-teal-500'
  };

  const gradientClass = diseaseColors[diseaseType as keyof typeof diseaseColors] || 'from-blue-500 to-indigo-500';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${gradientClass} rounded-xl shadow-lg`}>
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-2xl font-bold text-gray-800">Weekly Health Plan</h3>
          <p className="text-gray-600">Personalized recommendations for better health</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sleep Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100">
          <div className="flex items-center mb-3">
            <Moon className="w-6 h-6 text-indigo-600 mr-2" />
            <h4 className="text-lg font-semibold text-gray-800">Sleep Schedule</h4>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-gray-700 font-medium">{plan.sleepHours}</p>
            <p className="text-sm text-gray-500 mt-1">Consistent sleep helps regulate hormones and recovery</p>
          </div>
        </div>

        {/* Nutrition Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100">
          <div className="flex items-center mb-3">
            <Utensils className="w-6 h-6 text-emerald-600 mr-2" />
            <h4 className="text-lg font-semibold text-gray-800">Nutrition</h4>
          </div>
          <div className="space-y-2">
            {plan.foodRecommendations.map((food, index) => (
              <div key={index} className="flex items-start bg-white rounded-lg p-2 shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{food}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Exercise Section */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
          <div className="flex items-center mb-3">
            <Dumbbell className="w-6 h-6 text-amber-600 mr-2" />
            <h4 className="text-lg font-semibold text-gray-800">Exercise</h4>
          </div>
          <div className="space-y-2">
            {plan.workoutTips.map((tip, index) => (
              <div key={index} className="flex items-start bg-white rounded-lg p-2 shadow-sm">
                <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-800 font-medium">
          💡 <strong>Important:</strong> These recommendations are general guidelines. Please consult with your healthcare provider for personalized medical advice and treatment plans.
        </p>
      </div>
    </div>
  );
};

export default WeeklyPlan;