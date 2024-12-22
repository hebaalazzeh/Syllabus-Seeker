"use client"

import { useState } from 'react';
import { Plus, X, Upload, Calendar, FileText } from 'lucide-react';

interface FormData {
  schoolName: string;
  courseCode: string;
  courseName: string;
  professorName: string;
  year: number;
  term: string;
  textContent: string;
  file: File | null;
}

const UploadModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    schoolName: '',
    courseCode: '',
    courseName: '',
    professorName: '',
    year: new Date().getFullYear(),
    term: 'Fall',
    textContent: '',
    file: null,
  });

  // Generate years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );

  const terms = ['Fall', 'Winter', 'Spring', 'Summer'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement file upload logic
      let fileUrl = null;
      if (formData.file) {
        // Implement your file upload logic here
        fileUrl = 'your-file-url';
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          fileUrl,
        }),
      });

      if (!response.ok) throw new Error('Upload failed');

      setIsOpen(false);
      setFormData({
        schoolName: '',
        courseCode: '',
        courseName: '',
        professorName: '',
        year: new Date().getFullYear(),
        term: 'Fall',
        textContent: '',
        file: null,
      });

      // TODO: Add success notification
    } catch (error) {
      console.error('Upload error:', error);
      // TODO: Add error notification
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl 
                 hover:shadow-2xl transition-all duration-200 transform hover:scale-110 z-50"
        aria-label="Upload Syllabus"
      >
        <Plus className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-semibold dark:text-white">Upload Syllabus</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
                     transition-colors rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School Name</label>
              <input
                type="text"
                placeholder="Enter school name"
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-200"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Number/Section</label>
              <input
                type="text"
                placeholder="Enter course code"
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-200"
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Name</label>
              <input
                type="text"
                placeholder="Enter course name"
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-200"
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Professor Name</label>
              <input
                type="text"
                placeholder="Enter professor name"
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-200"
                value={formData.professorName}
                onChange={(e) => setFormData({ ...formData, professorName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-200"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Term</label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-200"
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
              >
                {terms.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Upload Syllabus File (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                        accept=".pdf,.doc,.docx"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Or Paste Syllabus Content
              </label>
              <textarea
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-200 min-h-[200px]"
                value={formData.textContent}
                onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                placeholder="Paste syllabus content here..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                       transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                       transition-colors duration-200 flex items-center gap-2"
            >
              <Upload className="h-5 w-5" />
              Upload Syllabus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;