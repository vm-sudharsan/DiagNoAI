import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, User, FileText, Home, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './LogoutButton';

interface NavigationHeaderProps {
  currentPage?: string;
  showBackButton?: boolean;
  backTo?: string;
  title?: string;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ 
  currentPage = '',
  showBackButton = false,
  backTo = '/dashboard',
  title
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', path: '/dashboard', icon: Home },
      { name: 'Reports', path: '/reports', icon: FileText },
      { name: 'Profile', path: '/profile', icon: User },
    ];

    // Only main users (not relatives) can access predictions
    if (user?.role === 'USER') {
      baseItems.splice(1, 0, { name: 'Predictions', path: '/disease-selection', icon: Activity });
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left side - Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {title || 'DiagNO-AI'}
              </h1>
              <p className="text-sm text-gray-600">
                {user?.role === 'RELATIVE'
                  ? `Family Member: ${user?.fullName}`
                  : `Welcome back, ${user?.fullName}`
                }
              </p>
            </div>
          </div>

          {/* Center - Navigation Items */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.name.toLowerCase() || 
                             (currentPage === 'prediction' && item.name === 'Predictions');
              
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <Home size={20} />
              </button>
            </div>
            
            {/* Desktop user menu */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <User size={20} />
                Profile
              </button>
              <LogoutButton variant="link" />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <div className="flex justify-around">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.name.toLowerCase() || 
                             (currentPage === 'prediction' && item.name === 'Predictions');
              
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-700 font-medium'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-xs">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationHeader;
