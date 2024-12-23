"use client"

import { useState } from 'react';
import { User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800
                 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden md:block text-gray-700 dark:text-gray-200">
          {user.name}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                      border border-gray-200 dark:border-gray-700 py-1">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>

          <button
            onClick={() => {/* Add settings handler */}}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
                     hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>

          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 
                     dark:text-red-400 dark:hover:bg-red-900/20 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;