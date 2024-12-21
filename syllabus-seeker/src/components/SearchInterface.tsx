"use client";

import React, { useState, useEffect } from 'react';
import UploadSyllabusModal from './UploadSyllabusModal';
import { School, Book, User } from 'lucide-react';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import Fuse from 'fuse.js';


// Sample data structure (in real app, this would come from your database)
const sampleSyllabi = [
  {
    id: 1,
    school: 'MIT',
    class: 'Computer Science 101: Introduction to Programming',
    professor: 'Dr. Smith Johnson',
    semester: 'Fall 2024',
    department: 'Computer Science'
  },
  {
    id: 2,
    school: 'Stanford',
    class: 'CS150: Data Structures',
    professor: 'Dr. Emily Williams',
    semester: 'Spring 2024',
    department: 'Computer Science'
  }
];

export default function SearchInterface() {
  const [searchResults, setSearchResults] = useState(sampleSyllabi);
  const [filters, setFilters] = useState({
    school: '',
    class: '',
    professor: ''
  });

  // Configure Fuse.js options
  const fuseOptions = {
    keys: ['school', 'class', 'professor', 'department'],
    threshold: 0.3, // Lower threshold = stricter matching
    includeScore: true,
    shouldSort: true,
    findAllMatches: true,
    minMatchCharLength: 2
  };

  const fuse = new Fuse(sampleSyllabi, fuseOptions);

  useEffect(() => {
    let results = sampleSyllabi;
    const hasActiveFilters = Object.values(filters).some(filter => filter.length > 0);

    if (hasActiveFilters) {
      // Combine all non-empty filters for searching
      const searchString = Object.values(filters)
        .filter(filter => filter.length > 0)
        .join(' ');

      const fuseResults = fuse.search(searchString);
      
      // If we have fuzzy matches
      if (fuseResults.length > 0) {
        results = fuseResults.map(result => result.item);
      } else {
        results = [];
      }
    }

    setSearchResults(results);
  }, [filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

    return (
        
    <div className="max-w-6xl mx-auto p-6">
            {/* Search Filters */}
            <div className="flex justify-end mb-6">
                <UploadSyllabusModal />
            </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="relative">
          <School className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by school..."
            value={filters.school}
            onChange={(e) => handleFilterChange('school', e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Book className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by class..."
            value={filters.class}
            onChange={(e) => handleFilterChange('class', e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by professor..."
            value={filters.professor}
            onChange={(e) => handleFilterChange('professor', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        {searchResults.length > 0 ? (
          searchResults.map((syllabus) => (
            <Card key={syllabus.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{syllabus.class}</CardTitle>
                <CardDescription>
                  {syllabus.school} • {syllabus.professor}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{syllabus.semester}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-2">No exact matches found</p>
            <p className="text-sm text-gray-500">
              Try adjusting your search terms or browse all syllabi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}