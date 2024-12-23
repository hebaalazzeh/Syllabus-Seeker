"use client"

import { useState } from 'react';
import { Plus, X, Upload, FileText, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

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

interface ErrorState {
  show: boolean;
  message: string;
}

interface UploadModalProps {
  onClose: () => void;
}

const UploadModal = ({ onClose }: UploadModalProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<ErrorState>({ show: false, message: '' });
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

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError({
          show: true,
          message: 'File size must be less than 10MB'
        });
        return;
      }
      setFormData(prev => ({ ...prev, file }));
      setError({ show: false, message: '' });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError({ show: false, message: '' });

    try {
      if (!formData.textContent && !formData.file) {
        throw new Error('Please provide either text content or a file');
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to upload syllabus');
      }

      onClose();
    } catch (error) {
      setError({
        show: true,
        message: error instanceof Error ? error.message : 'An error occurred'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-semibold dark:text-white">Upload Syllabus</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 
                     dark:hover:text-gray-200 transition-colors rounded-lg p-2 
                     hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error.show && (
          <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                School Name
              </label>
              <input
                type="text"
                placeholder="Enter school name"
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course Code
              </label>
              <input
                type="text"
                placeholder="Enter course code"
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course Name
              </label>
              <input
                type="text"
                placeholder="Enter course name"
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Professor Name
              </label>
              <input
                type="text"
                placeholder="Enter professor name"
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.professorName}
                onChange={(e) => setFormData({ ...formData, professorName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Year
              </label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Term
              </label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div
                {...getRootProps()}
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed 
                         rounded-lg transition-colors duration-200 cursor-pointer
                         ${isDragActive 
                           ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20' 
                           : 'border-gray-300 dark:border-gray-700'}`}
              >
                <div className="space-y-1 text-center">
                  <input {...getInputProps()} />
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <p className="pl-1">
                      {formData.file 
                        ? `Selected: ${formData.file.name}`
                        : isDragActive
                          ? 'Drop the file here'
                          : 'Drag & drop a file here, or click to select'}
                    </p>
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
                         min-h-[200px]"
                value={formData.textContent}
                onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                placeholder="Paste syllabus content here..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                       transition-colors duration-200"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                       transition-colors flex items-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Upload Syllabus
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;