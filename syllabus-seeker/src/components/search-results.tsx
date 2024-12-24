"use client";

import { useState, useEffect, useMemo } from "react";
import { Star, Download, FileText, Calendar, School, User } from "lucide-react";
import Fuse from "fuse.js";
import PreviewModal from "./preview-modal";

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

interface SearchResultsProps {
  results: Syllabus[];
  isLoading?: boolean;
  searchTerm?: string;
}

const SearchResults = ({ results, isLoading = false, searchTerm = "" }: SearchResultsProps) => {
  const [filteredResults, setFilteredResults] = useState<Syllabus[]>(results);
  const [previewSyllabus, setPreviewSyllabus] = useState<Syllabus | null>(null);

  const fuseOptions = useMemo(
    () => ({
      keys: [
        "course.name",
        "course.courseCode",
        "course.school.name",
        "professor.name",
        "term",
      ],
      threshold: 0.3,
      includeScore: true,
    }),
    []
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      const fuse = new Fuse(results, fuseOptions);
      const searchResults = fuse.search(searchTerm);
      setFilteredResults(searchResults.map((result) => result.item));
    } else {
      setFilteredResults(results);
    }
  }, [results, searchTerm, fuseOptions]);

  const getAverageRatings = (ratings: Rating[]) => {
    if (!ratings || ratings.length === 0) return "N/A";

    let courseTotal = 0;
    let courseCount = 0;

    ratings.forEach((rating) => {
      if (typeof rating.courseRating === "number") {
        courseTotal += rating.courseRating;
        courseCount++;
      }
    });

    return courseCount > 0 ? (courseTotal / courseCount).toFixed(1) : "N/A";
  };

  const handleDownload = (syllabus: Syllabus) => {
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

  if (filteredResults.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-xl text-gray-500 dark:text-gray-400">
            {searchTerm
              ? "No syllabi found matching your search"
              : "No syllabi found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-5xl mx-auto mt-8 space-y-6">
        {filteredResults.map((syllabus) => (
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
                  <span>
                    {syllabus.term} {syllabus.year}
                  </span>
                </div>
                <div className="text-yellow-600 dark:text-yellow-300">
                  Average Rating: {getAverageRatings(syllabus.ratings)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-4">
                <div className="flex gap-4">
                  {(syllabus.fileUrl || syllabus.textContent) && (
                    <button
                      onClick={() => setPreviewSyllabus(syllabus)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 
                               dark:text-blue-400 dark:hover:text-blue-300
                               bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg 
                               transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      Preview
                    </button>
                  )}
                  {(syllabus.fileUrl || syllabus.textContent) && (
                    <button
                      onClick={() => handleDownload(syllabus)}
                      className="flex items-center gap-2 text-green-600 hover:text-green-700 
                               dark:text-green-400 dark:hover:text-green-300
                               bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-lg 
                               transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {previewSyllabus && (
        <PreviewModal syllabus={previewSyllabus} onClose={() => setPreviewSyllabus(null)} />
      )}
    </>
  );
};

export default SearchResults;
