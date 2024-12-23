"use client"

import { useState, useCallback } from 'react';
import { Plus, X, Upload, FileText, AlertCircle, Star } from 'lucide-react';
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
  courseRating: number;
  professorRating: number;
  notes: string;
}

interface ErrorState {
  show: boolean;
  message: string;
}

interface UploadModalProps {
  onClose: () => void;
  onSuccess?: (data: any) => void;
}

const StarRating = ({ rating, onRate }: { rating: number; onRate: (rating: number) => void }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star === rating ? 0 : star)} // Toggle off if clicking same star
          className="focus:outline-none"
        >
          <Star
            className={`h-6 w-6 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
            } transition-colors cursor-pointer hover:fill-yellow-400 hover:text-yellow-400`}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          {rating} out of 5
        </span>
      )}
    </div>
  );
};

const UploadModal = ({ onClose, onSuccess }: UploadModalProps) => {
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
    courseRating: 0,
    professorRating: 0,
    notes: '',
  });

  // Generate years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );

  const terms = ['Fall', 'Winter', 'Spring', 'Summer'];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError({
          show: true,
          message: 'File size must be less than 10MB'
        });
        return;
      }
      setFormData(prev => ({ ...prev, file }));
      setError({ show: false, message: '' });
    }
  }, []);

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
    if (!formData.textContent && !formData.file) {
      setError({
        show: true,
        message: 'Please provide either text content or a file'
      });
      return;
    }
    
    setIsUploading(true);
    setError({ show: false, message: '' });

    try {
      let fileUrl = null;
      if (formData.file) {
        const fileFormData = new FormData();
        fileFormData.append('file', formData.file);

        const fileResponse = await fetch('/api/upload-file', {
          method: 'POST',
          body: fileFormData,
        });

        if (!fileResponse.ok) {
          throw new Error('File upload failed');
        }

        const fileData = await fileResponse.json();
        if (!fileData.success) {
          throw new Error(fileData.error || 'File upload failed');
        }

        fileUrl = fileData.data.secure_url;
      }

      const submissionData = {
        schoolName: formData.schoolName,
        courseCode: formData.courseCode,
        courseName: formData.courseName,
        professorName: formData.professorName,
        year: formData.year,
        term: formData.term,
        textContent: formData.textContent,
        fileUrl,
        courseRating: formData.courseRating || null,
        professorRating: formData.professorRating || null,
        notes: formData.notes.trim() || null,
      };

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to upload syllabus');
      }

      if (onSuccess) {
        onSuccess(result.data);
      }

      // Close with a slight delay to show success state
      setTimeout(() => {
        onClose();
      }, 500);

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
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-semibold dark:text-white">Upload Syllabus</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
                     transition-colors rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error.show && (
          <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                School Name <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course Code <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course Name <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Professor Name <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Year <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-200"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Term <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-200"
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                required
              >
                {terms.map((term) => (
                  <option key={term} value={term}>{term}</option>
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
                         transition-colors duration-200 min-h-[200px]"
                value={formData.textContent}
                              onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
placeholder="Paste syllabus content here..."
              />
            </div>
          </div>

          {/* Optional Ratings Section */}
          <div className="border-t dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Ratings & Feedback (Optional)
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Rating
                </label>
                <StarRating
                  rating={formData.courseRating}
                  onRate={(rating) => setFormData({ ...formData, courseRating: rating })}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  How would you rate this course overall?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Professor Rating
                </label>
                <StarRating
                  rating={formData.professorRating}
                  onRate={(rating) => setFormData({ ...formData, professorRating: rating })}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  How would you rate the professor's teaching?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-colors duration-200"
                  rows={3}
                  placeholder="Share your experience with the course and professor (optional)..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
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
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                       transition-colors duration-200 flex items-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Upload Syllabus</span>
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