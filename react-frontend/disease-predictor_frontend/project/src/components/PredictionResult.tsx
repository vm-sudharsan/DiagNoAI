import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { DiseaseType } from '../types/disease';

interface PredictionResultProps {
  diseaseType: DiseaseType;
  prediction: number;
  probability?: number;
  message: string;
  inputData: any;
}

const PredictionResult: React.FC<PredictionResultProps> = ({
  diseaseType,
  prediction,
  probability,
  message,
  inputData
}) => {
  const isAtRisk = prediction === 1;
  const riskPercentage = probability ? Math.round(probability * 100) : (isAtRisk ? 75 : 25);

  const diseaseInfo = {
    diabetes: { name: 'Diabetes', color: '#f97316', bgColor: 'bg-orange-50' },
    heart: { name: 'Heart Disease', color: '#ef4444', bgColor: 'bg-red-50' },
    stroke: { name: 'Stroke', color: '#8b5cf6', bgColor: 'bg-purple-50' },
    parkinsons: { name: "Parkinson's Disease", color: '#059669', bgColor: 'bg-green-50' }
  };

  const info = diseaseInfo[diseaseType];

  // Create chart data from input values (simplified)
  const getChartData = () => {
    const keys = Object.keys(inputData).slice(0, 6); // Show top 6 values
    return keys.map(key => ({
      name: key.replace(/[()%:]/g, '').substring(0, 10),
      value: inputData[key]
    }));
  };

  const pieData = [
    { name: 'Risk', value: riskPercentage, color: info.color },
    { name: 'Normal', value: 100 - riskPercentage, color: '#e5e7eb' }
  ];

  return (
    <div className="space-y-6">
      {/* Result Card */}
      <div className={`${info.bgColor} border-2 ${isAtRisk ? 'border-red-200' : 'border-green-200'} rounded-2xl p-6`}>
        <div className="flex items-center justify-center mb-4">
          {isAtRisk ? (
            <AlertTriangle className="w-16 h-16 text-red-500" />
          ) : (
            <CheckCircle className="w-16 h-16 text-green-500" />
          )}
        </div>
        
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {info.name} Prediction
          </h3>
          <p className={`text-xl font-semibold mb-3 ${isAtRisk ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${isAtRisk ? 'text-red-500' : 'text-green-500'}`}>
                {riskPercentage}%
              </div>
              <div className="text-sm text-gray-600">Risk Level</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Risk Assessment
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Input Values Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Key Health Indicators
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill={info.color} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;