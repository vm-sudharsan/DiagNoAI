import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, Users, LogOut, Settings } from 'lucide-react';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../NavigationHeader';

interface UserData {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  phoneNumber?: string;
  gender?: string;
  age?: number;
}

interface Relative {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [relatives, setRelatives] = useState<Relative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [userProfile, userRelatives] = await Promise.all([
        authService.getUserProfile(),
        authService.getRelatives()
      ]);
      setUser(userProfile);
      setRelatives(userRelatives);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleRemoveRelative = async (relativeId: number) => {
    if (window.confirm('Are you sure you want to remove this relative?')) {
      try {
        await authService.removeRelative(relativeId);
        setRelatives(relatives.filter(r => r.id !== relativeId));
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to remove relative';
        setError(errorMessage);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Navigation Header */}
      <NavigationHeader currentPage="profile" />

      <div className="max-w-4xl mx-auto py-8 px-4">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Information */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{user?.fullName}</h2>
                <p className="text-gray-600">@{user?.username}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                  {user?.role}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{user?.email}</span>
              </div>
              
              {user?.phoneNumber && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{user.phoneNumber}</span>
                </div>
              )}
              
              {user?.age && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{user.age} years old</span>
                </div>
              )}
              
              {user?.gender && (
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 capitalize">{user.gender}</span>
                </div>
              )}
            </div>
          </div>

          {/* Relatives */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Relatives</h3>
              </div>
              <button
                onClick={() => navigate('/add-relative')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
              >
                Add Relative
              </button>
            </div>

            {relatives.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No relatives added yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Add relatives to share your health data with them
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {relatives.map((relative) => (
                  <div key={relative.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-800">{relative.fullName}</h4>
                      <p className="text-sm text-gray-600">@{relative.username}</p>
                      <p className="text-sm text-gray-500">{relative.email}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveRelative(relative.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/disease-selection')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 text-left"
            >
              <h4 className="font-semibold text-blue-800 mb-2">New Prediction</h4>
              <p className="text-sm text-blue-600">Start a new health assessment</p>
            </button>
            
            <button
              onClick={() => navigate('/reports')}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 text-left"
            >
              <h4 className="font-semibold text-green-800 mb-2">View Reports</h4>
              <p className="text-sm text-green-600">Check your test history</p>
            </button>
            
            <button
              onClick={() => navigate('/add-relative')}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 text-left"
            >
              <h4 className="font-semibold text-purple-800 mb-2">Add Relative</h4>
              <p className="text-sm text-purple-600">Share access with family</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
