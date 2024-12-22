"use client";

import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { SyllabusList } from '@/components/SyllabusList';
import { UploadSyllabusModal } from '@/components/UploadSyllabusModal';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Syllabus Seeker</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Main Content */}
        <SyllabusList isDarkMode={isDarkMode} />

        {/* Upload Button is now part of SyllabusList */}
        <Toaster />
      </div>
    </div>
  );
}