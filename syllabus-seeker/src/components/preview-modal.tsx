"use client"

import { useState } from 'react';
import { X, Download, FileText, Star, School, User, Calendar } from 'lucide-react';

interface Rating {
  id: string;
  rating: number;
  comment?: string | null;
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

interface PreviewModalProps {
  onClose: () => void;
  syllabus: Syllabus;
}

const PreviewModal = ({ onClose, syllabus }: PreviewModalProps) => {
  const handleDownload = async () => {
    if (syllabus.fileUrl) {
      window.open(syllabus.fileUrl, '_blank');
    } else if (syllabus.textContent) {
      const blob = new Blob([syllabus.textContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${syllabus.course.courseCode}-syllabus.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const getAverageRating = (ratings: Rating[]) => {
    if (!ratings || ratings.length === 0) return 0;
    return ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
  };

  if (!syllabus) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-5xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <School className="h-4 w-4" />
              <span>{syllabus.course.school.name}</span>
            </div>
            <h2 className="text-2xl font-semibold dark:text-white">
              {syllabus.course.courseCode} - {syllabus.course.name}
            </h2>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <User className="h-4 w-4" />
              <span>Professor {syllabus.professor.name}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{syllabus.term} {syllabus.year}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 
                       dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 
                       dark:hover:bg-blue-900/30 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 
                       dark:hover:text-gray-200 transition-colors rounded-lg p-2 
                       hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main content */}
          <div className="flex-1 overflow-auto p-6">
            {syllabus.fileUrl ? (
              <iframe
                src={syllabus.fileUrl}
                className="w-full h-full min-h-[600px] rounded-lg border dark:border-gray-700"
                title="Syllabus Preview"
              />
            ) : syllabus.textContent ? (
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200">
                  {syllabus.textContent}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <FileText className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  No content available
                </p>
              </div>
            )}
          </div>

          {/* Ratings & Reviews Sidebar */}
          {syllabus.ratings && syllabus.ratings.length > 0 && (
            <div className="w-96 border-l dark:border-gray-700 overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold dark:text-white">
                    Ratings & Reviews
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {syllabus.ratings.length} {syllabus.ratings.length === 1 ? 'Review' : 'Reviews'}
                  </span>
                </div>

                <div className="space-y-6">
                  {syllabus.ratings.map((rating) => (
                    <div 
                      key={rating.id}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= rating.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {rating.rating}/5
                        </span>
                      </div>

                      {rating.comment && (
                        <div className="mb-3">
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            &ldquo;{rating.comment}&rdquo;
                          </p>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(rating.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;