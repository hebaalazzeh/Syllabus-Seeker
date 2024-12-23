"use client"

import { Star, Download, FileText, Calendar, School, User } from 'lucide-react';

interface Rating {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface Syllabus {
  id: string;
  year: number;
  term: string;
  fileUrl?: string | null;
  textContent?: string | null;
  course: {
    name: string;
    courseCode: string;
    school: {
      name: string;
    };
  };
  professor: {
    name: string;
  };
  ratings: Rating[];
}

interface SearchResultsProps {
  results: Syllabus[];
  isLoading?: boolean;
}

const SearchResults = ({ results = [], isLoading = false }: SearchResultsProps) => {
  const getAverageRating = (ratings: Rating[]) => {
    if (!ratings || ratings.length === 0) return 0;
    return ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8">
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-40 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No syllabi found matching your search
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 space-y-6">
      {results.map((syllabus) => (
        <div 
          key={syllabus.id} 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform 
                   transition-all duration-200 hover:scale-[1.02]"
        >
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <School className="h-4 w-4" />
                <span>{syllabus.course.school.name}</span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {syllabus.course.courseCode} - {syllabus.course.name}
              </h3>
              
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <User className="h-4 w-4" />
                <span>Professor {syllabus.professor.name}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{syllabus.term} {syllabus.year}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              {syllabus.ratings && syllabus.ratings.length > 0 && (
                <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium text-yellow-700 dark:text-yellow-300">
                    {getAverageRating(syllabus.ratings).toFixed(1)}
                  </span>
                </div>
              )}

              <div className="flex gap-4">
                {syllabus.fileUrl && (
                  <a
                    href={syllabus.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 
                             dark:text-blue-400 dark:hover:text-blue-300
                             bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg 
                             transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                )}
                {syllabus.textContent && (
                  <button
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 
                             dark:text-green-400 dark:hover:text-green-300
                             bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-lg 
                             transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    Preview
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;