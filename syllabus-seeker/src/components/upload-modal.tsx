"use client";

import { useCallback, useState } from "react";
import { X, Upload, FileText, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";

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
  onSuccess?: (data: Record<string, unknown>) => void;
}

const UploadModal = ({ onClose, onSuccess }: UploadModalProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<ErrorState>({ show: false, message: "" });
  const [formData, setFormData] = useState<FormData>({
    schoolName: "",
    courseCode: "",
    courseName: "",
    professorName: "",
    year: new Date().getFullYear(),
    term: "Fall",
    textContent: "",
    file: null,
    courseRating: 0,
    professorRating: 0,
    notes: "",
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.textContent && !formData.file) {
      setError({ show: true, message: "Please provide either text content or a file" });
      return;
    }

    setIsUploading(true);

    try {
      let fileUrl = null;

      if (formData.file) {
        const fileFormData = new FormData();
        fileFormData.append("file", formData.file);

        const fileResponse = await fetch("/api/upload-file", {
          method: "POST",
          body: fileFormData,
        });

        if (!fileResponse.ok) {
          throw new Error("File upload failed");
        }

        const fileData = await fileResponse.json();
        fileUrl = fileData.data.secure_url;
      }

      const submissionData = {
        ...formData,
        fileUrl,
        notes: formData.notes.trim() || null,
      };

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to upload syllabus");
      }

      if (onSuccess) onSuccess(result.data);

      setTimeout(() => onClose(), 500);
    } catch (error) {
      setError({ show: true, message: error instanceof Error ? error.message : "An error occurred" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-semibold dark:text-white">Upload Syllabus</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <X className="h-6 w-6" />
          </button>
        </div>
        {error.show && (
          <div className="p-4 bg-red-100 text-red-700 rounded">{error.message}</div>
        )}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Add form fields */}
          <button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
