import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LogoutButtonProps {
  className?: string;
  showIcon?: boolean;
  variant?: 'button' | 'link';
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = '', 
  showIcon = true, 
  variant = 'button' 
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const baseClasses = variant === 'button' 
    ? 'flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg'
    : 'flex items-center text-sm font-medium transition-colors duration-200';

  const variantClasses = variant === 'button'
    ? 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
    : 'text-gray-600 hover:text-red-600';

  return (
    <button
      onClick={handleLogout}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      Logout
    </button>
  );
};

export default LogoutButton;
