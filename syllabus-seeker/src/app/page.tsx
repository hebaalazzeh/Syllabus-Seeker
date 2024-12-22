"use client"

import { useState } from 'react'
import SearchForm from '@/components/search-form'
import SearchResults from '@/components/search-results'
import UploadModal from '@/components/upload-modal'

export default function Home() {
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false) // State for modal visibility

  const handleSearch = async (params: any) => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value as string)
      })

      const response = await fetch(`/api/search?${queryParams}`)
      if (!response.ok) throw new Error('Search failed')
      
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error('Search error:', error)
      // TODO: Implement error handling UI
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 dark:text-white">Syllabus Seeker</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find and share course syllabi from your school
        </p>
      </header>

      <SearchForm onSearch={handleSearch} />
      <SearchResults results={searchResults} isLoading={isLoading} />
      
      {/* Button to open modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        +
      </button>

      {/* Upload Modal */}
      {isModalOpen && (
        <UploadModal 
          onClose={() => setIsModalOpen(false)} // Close modal handler
          onUpload={(file) => {
            console.log("File uploaded:", file);
            setIsModalOpen(false); // Close modal after upload
          }} 
        />
      )}
    </div>
  )
}
