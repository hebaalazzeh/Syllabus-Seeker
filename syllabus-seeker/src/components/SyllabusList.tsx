"use client";

import { useState, useEffect } from 'react';
import { Search, Loader2, Book, Calendar, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Input } from './ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from './ui/use-toast';

interface Syllabus {
  id: string;
  school: string;
  class_name: string;
  professor: string;
  semester: string;
  year: number;
  content_type: string;
  content: string;
  created_at: string;
}

export function SyllabusList() {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { toast } = useToast();

  const fetchSyllabi = async (search?: string) => {
    try {
      setIsLoading(true);
      const url = new URL('/api/syllabus', window.location.origin);
      if (search) {
        url.searchParams.append('search', search);
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setSyllabi(data.syllabi);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching syllabi:', error);
      toast({
        title: "Error",
        description: "Failed to fetch syllabi. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabi(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search syllabi by school, class, or professor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-white"
          />
        </div>
      </div>

      {/* Results */}
      <div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-gray-500 mt-4">Loading syllabi...</p>
          </div>
        ) : syllabi.length === 0 ? (
          <div className="text-center py-12">
            <Book className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-semibold text-gray-600">
              {searchTerm ? "No syllabi found matching your search" : "No syllabi uploaded yet"}
            </p>
            <p className="text-gray-500 mt-2">
              {searchTerm ? "Try adjusting your search terms" : "Be the first to share a syllabus!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {syllabi.map((syllabus) => (
              <Card key={syllabus.id} className="relative bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Book className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-lg">{syllabus.class_name}</CardTitle>
                  </div>
                  <CardDescription className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{syllabus.professor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{syllabus.semester} {syllabus.year}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{syllabus.school}</p>
                  {syllabus.content_type === 'text' ? (
                    <p className="mt-4 text-sm line-clamp-3 text-gray-600">
                      {syllabus.content}
                    </p>
                  ) : (
                    <button className="mt-4 text-sm text-blue-500 hover:text-blue-600 flex items-center space-x-1">
                      <span>View Syllabus</span>
                    </button>
                  )}
                  <div className="mt-4 text-xs text-gray-400">
                    Added {new Date(syllabus.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}