"use client"

import { FileText, Download } from 'lucide-react';

interface FilePreviewProps {
  fileUrl?: string | null;
  textContent?: string | null;
  fileName?: string;
}

const FilePreview = ({ fileUrl, textContent, fileName }: FilePreviewProps) => {
  if (fileUrl) {
    const fileExtension = fileUrl.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'pdf') {
      return (
        <div className="w-full h-full min-h-[600px] p-4">
          <object
            data={fileUrl}
            type="application/pdf"
            className="w-full h-full min-h-[600px] rounded-lg border dark:border-gray-700"
          >
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Unable to display PDF directly. Click below to open in a new tab.
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
                         hover:bg-blue-700 transition-colors"
              >
                <FileText className="h-5 w-5" />
                Open PDF
              </a>
            </div>
          </object>
        </div>
      );
    } else if (['doc', 'docx'].includes(fileExtension || '')) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <FileText className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is a Word document. Click below to download and view.
          </p>
          <a
            href={fileUrl}
            download={fileName || true}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            Download Document
          </a>
        </div>
      );
    }
  }

  if (textContent) {
    return (
      <div className="prose dark:prose-invert max-w-none p-6">
        <pre className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200 
                     bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border 
                     dark:border-gray-700">
          {textContent}
        </pre>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[600px] p-8 text-center">
      <FileText className="h-16 w-16 text-gray-400 mb-4" />
      <p className="text-gray-600 dark:text-gray-300">
        No preview available for this syllabus
      </p>
    </div>
  );
};

export default FilePreview;