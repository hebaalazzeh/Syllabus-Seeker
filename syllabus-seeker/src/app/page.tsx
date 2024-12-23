"use client"

import { useState } from 'react';
import SearchForm from '@/components/search-form';
import SearchResults from '@/components/search-results';
import UploadModal from '@/components/upload-modal';
import { Plus } from 'lucide-react';

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (params: any) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value as string);
      });

      const response = await fetch(`/api/search?${queryParams}`);
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="container mx-auto py-8 px-4 flex-grow">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            Syllabus Seeker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find and share course syllabi from your school
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <SearchForm onSearch={handleSearch} />
          <div className="mt-8">
            <SearchResults results={searchResults} isLoading={isLoading} />
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-16 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 
                   rounded-full shadow-lg hover:shadow-xl transition-all duration-200 
                   transform hover:scale-110"
          aria-label="Upload Syllabus"
        >
          <Plus className="h-6 w-6" />
        </button>

        {isModalOpen && (
          <UploadModal 
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>

      <footer className="w-full py-4 px-4 mt-auto bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="container mx-auto text-center text-sm">
          <p className="text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} Syllabus Seeker. Created by Heba Alazzeh
          </p>
        </div>
      </footer>
    </div>
  );
}