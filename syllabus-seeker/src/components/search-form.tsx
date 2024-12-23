"use client"

import { useState } from "react";
import { Search, School, Book, User } from "lucide-react";

interface SearchFormProps {
  onSearch: (params: any) => void;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [searchParams, setSearchParams] = useState({
    school: '',
    course: '',
    professor: '',
    year: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <School className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="School name"
            className="pl-10 w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700
                     dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchParams.school}
            onChange={(e) => setSearchParams({ ...searchParams, school: e.target.value })}
          />
        </div>

        <div className="relative">
          <Book className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Course code or name"
            className="pl-10 w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700
                     dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchParams.course}
            onChange={(e) => setSearchParams({ ...searchParams, course: e.target.value })}
          />
        </div>

        <div className="relative">
          <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Professor name"
            className="pl-10 w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700
                     dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchParams.professor}
            onChange={(e) => setSearchParams({ ...searchParams, professor: e.target.value })}
          />
        </div>

        <select
          className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700
                   dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center gap-2
                 transition-colors"
      >
        <Search className="h-5 w-5" />
        Search Syllabi
      </button>
    </form>
  );
};

export default SearchForm;