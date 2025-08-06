import React, { useState } from 'react';
import { DiabetesData } from '../../types/disease';

interface DiabetesFormProps {
  onSubmit: (data: DiabetesData) => void;
  loading: boolean;
}

const DiabetesForm: React.FC<DiabetesFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<DiabetesData>({
    pregnancies: 0,
    glucose: 120,
    bloodPressure: 80,
    skinThickness: 20,
    insulin: 80,
    bmi: 25,
    diabetesPedigreeFunction: 0.5,
    age: 30
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
    { name: 'pregnancies', label: 'Number of Pregnancies', min: 0, max: 17, step: 1 },
    { name: 'glucose', label: 'Plasma Glucose (mg/dL)', min: 0, max: 200, step: 1 },
    { name: 'bloodPressure', label: 'Blood Pressure (mm Hg)', min: 0, max: 150, step: 1 },
    { name: 'skinThickness', label: 'Skin Thickness (mm)', min: 0, max: 100, step: 1 },
    { name: 'insulin', label: 'Insulin (mu U/ml)', min: 0, max: 900, step: 1 },
    { name: 'bmi', label: 'BMI (kg/m²)', min: 0, max: 70, step: 0.1 },
    { name: 'diabetesPedigreeFunction', label: 'Diabetes Pedigree Function', min: 0, max: 3, step: 0.001 },
    { name: 'age', label: 'Age (years)', min: 21, max: 120, step: 1 }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type="number"
              name={field.name}
              value={formData[field.name as keyof DiabetesData]}
              onChange={handleChange}
              min={field.min}
              max={field.max}
              step={field.step}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {loading ? 'Analyzing...' : 'Predict Diabetes Risk'}
      </button>
    </form>
  );
};

export default DiabetesForm;