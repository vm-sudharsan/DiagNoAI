import React, { useState } from 'react';
import { HeartDiseaseData } from '../../types/disease';

interface HeartDiseaseFormProps {
  onSubmit: (data: HeartDiseaseData) => void;
  loading: boolean;
}

const HeartDiseaseForm: React.FC<HeartDiseaseFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<HeartDiseaseData>({
    age: 50,
    sex: 1,
    cp: 0,
    trestbps: 120,
    chol: 200,
    fbs: 0,
    restecg: 0,
    thalach: 150,
    exang: 0,
    oldpeak: 1.0,
    slope: 1,
    ca: 0,
    thal: 2
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="29"
            max="120"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sex</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option value={1}>Male</option>
            <option value={0}>Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Chest Pain Type</label>
          <select
            name="cp"
            value={formData.cp}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option value={0}>Typical Angina</option>
            <option value={1}>Atypical Angina</option>
            <option value={2}>Non-anginal Pain</option>
            <option value={3}>Asymptomatic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Resting Blood Pressure</label>
          <input
            type="number"
            name="trestbps"
            value={formData.trestbps}
            onChange={handleChange}
            min="90"
            max="200"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cholesterol (mg/dl)</label>
          <input
            type="number"
            name="chol"
            value={formData.chol}
            onChange={handleChange}
            min="100"
            max="600"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Fasting Blood Sugar {'>'} 120 mg/dl</label>
          <select
            name="fbs"
            value={formData.fbs}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Resting ECG</label>
          <select
            name="restecg"
            value={formData.restecg}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option value={0}>Normal</option>
            <option value={1}>ST-T Wave Abnormality</option>
            <option value={2}>Left Ventricular Hypertrophy</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Max Heart Rate</label>
          <input
            type="number"
            name="thalach"
            value={formData.thalach}
            onChange={handleChange}
            min="70"
            max="220"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Exercise Induced Angina</label>
          <select
            name="exang"
            value={formData.exang}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">ST Depression</label>
          <input
            type="number"
            name="oldpeak"
            value={formData.oldpeak}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Slope</label>
          <select
            name="slope"
            value={formData.slope}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option value={0}>Downsloping</option>
            <option value={1}>Flat</option>
            <option value={2}>Upsloping</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">CA</label>
          <select
            name="ca"
            value={formData.ca}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Thal</label>
          <select
            name="thal"
            value={formData.thal}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option value={1}>Normal</option>
            <option value={2}>Fixed Defect</option>
            <option value={3}>Reversable Defect</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {loading ? 'Analyzing...' : 'Predict Heart Disease Risk'}
      </button>
    </form>
  );
};

export default HeartDiseaseForm;