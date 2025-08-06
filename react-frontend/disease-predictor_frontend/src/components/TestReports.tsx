import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, User, ArrowLeft, Heart, Activity, Brain, Droplets } from 'lucide-react';
import LogoutButton from './LogoutButton';
import NavigationHeader from './NavigationHeader';
import { reportService, TestReport } from '../services/reportService';
import { useAuth } from '../context/AuthContext';



const TestReports: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<TestReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const reports = await reportService.getMyReports();
      setReports(reports);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load reports';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getDiseaseIcon = (diseaseType: string) => {
    switch (diseaseType.toLowerCase()) {
      case 'diabetes':
        return <Droplets className="w-6 h-6 text-orange-600" />;
      case 'heart':
        return <Heart className="w-6 h-6 text-red-600" />;
      case 'stroke':
        return <Activity className="w-6 h-6 text-purple-600" />;
      case 'parkinsons':
        return <Brain className="w-6 h-6 text-green-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  const getDiseaseColor = (diseaseType: string) => {
    switch (diseaseType.toLowerCase()) {
      case 'diabetes':
        return 'bg-orange-50 border-orange-200';
      case 'heart':
        return 'bg-red-50 border-red-200';
      case 'stroke':
        return 'bg-purple-50 border-purple-200';
      case 'parkinsons':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskLevel = (prediction: number, probability?: number) => {
    if (prediction === 1) {
      return {
        level: 'High Risk',
        color: 'text-red-600 bg-red-100',
        probability: probability ? `${(probability * 100).toFixed(1)}%` : 'N/A'
      };
    } else {
      return {
        level: 'Low Risk',
        color: 'text-green-600 bg-green-100',
        probability: probability ? `${((1 - probability) * 100).toFixed(1)}%` : 'N/A'
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Navigation Header */}
      <NavigationHeader currentPage="reports" />

      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {user?.role === 'RELATIVE' ? 'Family Health Reports' : 'Test Reports'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'RELATIVE'
              ? 'View health assessment history from your family members'
              : 'View your health assessment history'
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {reports.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reports Yet</h3>
            <p className="text-gray-600 mb-6">You haven't completed any health assessments yet.</p>
            <button
              onClick={() => navigate('/disease-selection')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Start Your First Assessment
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => {
              const riskInfo = getRiskLevel(report.predictionResult, report.probability);
              return (
                <div
                  key={report.id}
                  className={`bg-white rounded-2xl shadow-lg border-2 ${getDiseaseColor(report.diseaseType)} p-6 hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        {getDiseaseIcon(report.diseaseType)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 capitalize">
                          {report.diseaseType} Assessment
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(report.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {report.userName}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${riskInfo.color}`}>
                        {riskInfo.level}
                      </span>
                      {report.probability && (
                        <p className="text-sm text-gray-600 mt-1">
                          Confidence: {riskInfo.probability}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Assessment Result:</h4>
                    <p className="text-gray-700 leading-relaxed">{report.predictionMessage}</p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => navigate(`/prediction/${report.diseaseType.toLowerCase()}`)}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                      Take New Assessment →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {reports.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Assessment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
                <div className="text-sm text-blue-800">Total Assessments</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {reports.filter(r => r.predictionResult === 0).length}
                </div>
                <div className="text-sm text-green-800">Low Risk Results</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {reports.filter(r => r.predictionResult === 1).length}
                </div>
                <div className="text-sm text-red-800">High Risk Results</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(reports.map(r => r.diseaseType)).size}
                </div>
                <div className="text-sm text-purple-800">Disease Types Tested</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestReports;
