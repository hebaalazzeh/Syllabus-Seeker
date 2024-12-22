"use client"

import { useState } from 'react';
import { Search, School, Book, User, Calendar } from 'lucide-react';

interface SearchParams {
  school: string;
  course: string;
  professor: string;
  year: string;
}

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    school: '',
    course: '',
    professor: '',
    year: ''
  });

  // Generate years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative">
          <School className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Enter School Name"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-colors duration-200"
            value={searchParams.school}
            onChange={(e) => setSearchParams({ ...searchParams, school: e.target.value })}
          />
        </div>

        <div className="relative">
          <Book className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Course Code or Name"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-colors duration-200"
            value={searchParams.course}
            onChange={(e) => setSearchParams({ ...searchParams, course: e.target.value })}
          />
        </div>

        <div className="relative">
          <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Professor Name"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-colors duration-200"
            value={searchParams.professor}
            onChange={(e) => setSearchParams({ ...searchParams, professor: e.target.value })}
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <select
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-colors duration-200 appearance-none"
            value={searchParams.year}
            onChange={(e) => setSearchParams({ ...searchParams, year: e.target.value })}
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg
                 flex items-center justify-center gap-2 transition-colors duration-200
                 shadow-lg hover:shadow-xl font-medium"
      >
        <Search className="h-5 w-5" />
        Search Syllabi
      </button>
    </form>
  );
};

export default SearchForm;