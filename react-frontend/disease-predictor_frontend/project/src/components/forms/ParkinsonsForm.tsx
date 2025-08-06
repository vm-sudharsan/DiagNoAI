import React, { useState } from 'react';
import { ParkinsonsData } from '../../types/disease';

interface ParkinsonsFormProps {
  onSubmit: (data: ParkinsonsData) => void;
  loading: boolean;
}

const ParkinsonsForm: React.FC<ParkinsonsFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<ParkinsonsData>({
    'MDVP:Fo(Hz)': 150,
    'MDVP:Fhi(Hz)': 200,
    'MDVP:Flo(Hz)': 100,
    'MDVP:Jitter(%)': 0.005,
    'MDVP:Jitter(Abs)': 0.00005,
    'MDVP:RAP': 0.003,
    'MDVP:PPQ': 0.003,
    'Jitter:DDP': 0.009,
    'MDVP:Shimmer': 0.03,
    'MDVP:Shimmer(dB)': 0.3,
    'Shimmer:APQ3': 0.015,
    'Shimmer:APQ5': 0.018,
    'MDVP:APQ': 0.02,
    'Shimmer:DDA': 0.045,
    NHR: 0.02,
    HNR: 20,
    RPDE: 0.5,
    DFA: 0.7,
    spread1: -6,
    spread2: 0.2,
    D2: 2.5,
    PPE: 0.2
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fields = [
    { name: 'MDVP:Fo(Hz)', label: 'Average vocal fundamental frequency', min: 80, max: 250, step: 0.1 },
    { name: 'MDVP:Fhi(Hz)', label: 'Maximum vocal fundamental frequency', min: 100, max: 600, step: 0.1 },
    { name: 'MDVP:Flo(Hz)', label: 'Minimum vocal fundamental frequency', min: 60, max: 200, step: 0.1 },
    { name: 'MDVP:Jitter(%)', label: 'Jitter percentage', min: 0, max: 0.1, step: 0.0001 },
    { name: 'MDVP:Jitter(Abs)', label: 'Absolute jitter', min: 0, max: 0.001, step: 0.000001 },
    { name: 'MDVP:RAP', label: 'Relative amplitude perturbation', min: 0, max: 0.05, step: 0.0001 },
    { name: 'MDVP:PPQ', label: 'Five-point period perturbation quotient', min: 0, max: 0.05, step: 0.0001 },
    { name: 'Jitter:DDP', label: 'Average absolute difference of differences', min: 0, max: 0.15, step: 0.0001 },
    { name: 'MDVP:Shimmer', label: 'Shimmer', min: 0, max: 0.2, step: 0.001 },
    { name: 'MDVP:Shimmer(dB)', label: 'Shimmer in dB', min: 0, max: 2, step: 0.01 },
    { name: 'Shimmer:APQ3', label: '3-point amplitude perturbation quotient', min: 0, max: 0.1, step: 0.001 },
    { name: 'Shimmer:APQ5', label: '5-point amplitude perturbation quotient', min: 0, max: 0.1, step: 0.001 },
    { name: 'MDVP:APQ', label: 'Amplitude perturbation quotient', min: 0, max: 0.15, step: 0.001 },
    { name: 'Shimmer:DDA', label: 'Average absolute differences', min: 0, max: 0.3, step: 0.001 },
    { name: 'NHR', label: 'Noise-to-harmonics ratio', min: 0, max: 1, step: 0.001 },
    { name: 'HNR', label: 'Harmonics-to-noise ratio', min: 0, max: 40, step: 0.1 },
    { name: 'RPDE', label: 'Recurrence period density entropy', min: 0, max: 1, step: 0.001 },
    { name: 'DFA', label: 'Detrended fluctuation analysis', min: 0, max: 1, step: 0.001 },
    { name: 'spread1', label: 'Fundamental frequency variation', min: -10, max: 0, step: 0.01 },
    { name: 'spread2', label: 'Fundamental frequency variation', min: 0, max: 1, step: 0.001 },
    { name: 'D2', label: 'Nonlinear dynamical complexity', min: 0, max: 5, step: 0.01 },
    { name: 'PPE', label: 'Pitch period entropy', min: 0, max: 1, step: 0.001 }
  ];

  return (
    <div className="max-h-96 overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type="number"
                name={field.name}
                value={formData[field.name as keyof ParkinsonsData]}
                onChange={handleChange}
                min={field.min}
                max={field.max}
                step={field.step}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {loading ? 'Analyzing...' : 'Predict Parkinson\'s Risk'}
        </button>
      </form>
    </div>
  );
};

export default ParkinsonsForm;