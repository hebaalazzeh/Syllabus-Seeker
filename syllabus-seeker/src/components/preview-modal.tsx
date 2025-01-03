"use client";

import { X, Download, Star, Calendar, School, User } from "lucide-react";
import FilePreview from "./file-preview";

interface Rating {
  id: string;
  courseRating?: number | null;
  professorRating?: number | null;
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
      window.open(syllabus.fileUrl, "_blank");
    } else if (syllabus.textContent) {
      const blob = new Blob([syllabus.textContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${syllabus.course.courseCode}-syllabus.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const filledRatings = syllabus.ratings.filter(
    (rating) => rating.courseRating || rating.professorRating || rating.comment
  );

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
              <span>
                {syllabus.term} {syllabus.year}
              </span>
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
          <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            <div className="min-h-[600px] h-full">
              <FilePreview
                fileUrl={syllabus.fileUrl}
                textContent={syllabus.textContent}
                fileName={`${syllabus.course.courseCode}-syllabus`}
              />
            </div>
          </div>

          {/* Ratings Sidebar */}
          {filledRatings.length > 0 && (
            <div className="w-96 border-l dark:border-gray-700 overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
              <div className="p-6">
                <h3 className="text-lg font-semibold dark:text-white mb-4">
                  Ratings & Reviews
                </h3>
                <div className="space-y-6">
                  {filledRatings.map((rating) => (
                    <div
                      key={rating.id}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
                    >
                      {rating.courseRating && (
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Course Rating: {rating.courseRating}/5
                          </span>
                        </div>
                      )}
                      {rating.professorRating && (
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Professor Rating: {rating.professorRating}/5
                          </span>
                        </div>
                      )}
                      {rating.comment && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                          &ldquo;{rating.comment}&rdquo;
                        </p>
                      )}
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(rating.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
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
