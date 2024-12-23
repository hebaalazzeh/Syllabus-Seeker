"use client"

import { useState } from 'react';
import SearchForm from '@/components/search-form';
import SearchResults from '@/components/search-results';
import UploadModal from '@/components/upload-modal';

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchStart = () => {
    setIsLoading(true);
  };

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            Syllabus Seeker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find and share course syllabi from your school
          </p>
        </header>

        <SearchForm 
          onSearch={handleSearchResults}
          onSearchStart={handleSearchStart}
        />
        
        <div className="mt-8">
          <SearchResults results={searchResults} isLoading={isLoading} />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full 
                   shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
          aria-label="Upload Syllabus"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        {isModalOpen && (
          <UploadModal 
            onClose={() => setIsModalOpen(false)}
            onSuccess={(data) => {
              setSearchResults(prev => [data, ...prev]);
              setIsModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}