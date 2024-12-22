import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Search, Book, User, Calendar, Download, School, Moon, Sun, Plus, X, Upload, Star, MessageSquare } from 'lucide-react';
import { fetchSyllabi, uploadSyllabus, uploadFile } from '@/lib/client';

const SyllabusSeeker = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syllabi, setSyllabi] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadSyllabi();
  }, [searchQuery, departmentFilter, yearFilter, schoolFilter]);

  async function loadSyllabi() {
    try {
      setIsLoading(true);
      const filters = {
        query: searchQuery,
        department: departmentFilter !== 'all' ? departmentFilter : undefined,
        year: yearFilter !== 'all' ? yearFilter : undefined,
        school: schoolFilter !== 'all' ? schoolFilter : undefined,
      };
      
      const data = await fetchSyllabi(filters);
      setSyllabi(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(0);
      const { url } = await uploadFile(file);
      
      setNewSyllabus(prev => ({
        ...prev,
        fileUrl: url,
      }));
      
      setUploadProgress(100);
    } catch (err) {
      setError('Failed to upload file');
      setUploadProgress(0);
    }
  }

  async function handleSubmit() {
    try {
      setIsLoading(true);
      await uploadSyllabus(newSyllabus);
      setShowUploadModal(false);
      loadSyllabi();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Rest of the component remains similar, but we'll add loading and error states

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg">
          {error}
        </div>
      )}

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header and search components remain the same */}
        
        {/* Syllabus List with Loading State */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4">Loading syllabi...</p>
            </div>
          ) : (
            <>
              {syllabi.map((syllabus) => (
                <Card key={syllabus.id} className="p-4">
                  {/* Syllabus card content remains the same */}
                </Card>
              ))}

              {syllabi.length === 0 && (
                <div className="text-center py-12">
                  <Book size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="mb-2">No syllabi found</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Upload the first syllabus
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Upload Modal with Progress */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
            <div className="container mx-auto max-w-2xl p-4">
              <Card className="p-6">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold">Upload Syllabus</h2>
                  <button onClick={() => setShowUploadModal(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* File Upload */}
                  <div className="border-2 border-dashed rounded-xl p-4 text-center">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-8 w-8 mb-2" />
                      <span>Click to upload or drag and drop</span>
                      <span className="text-sm text-gray-500">PDF, DOC, DOCX</span>
                    </label>

                    {uploadProgress > 0 && (
                      <div className="mt-4">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form fields remain the same */}
                  
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full py-2 px-4 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isLoading ? 'Uploading...' : 'Upload Syllabus'}
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyllabusSeeker;