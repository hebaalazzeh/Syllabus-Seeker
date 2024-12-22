"use client";

import { useState } from 'react';
import { Upload, Plus, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Textarea from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { Check } from 'lucide-react';

interface FormData {
  school: string;
  class: string;
  professor: string;
  semester: string;
  year: string;
  uploadType: 'text' | 'file';
  syllabusText: string;
  syllabusFile: File | null;
}

const initialFormData: FormData = {
  school: '',
  class: '',
  professor: '',
  semester: '',
  year: '',
  uploadType: 'text',
  syllabusText: '',
  syllabusFile: null,
};

export function UploadSyllabusModal() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        syllabusFile: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/syllabus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          syllabusFile: formData.uploadType === 'file' ? await fileToBase64(formData.syllabusFile) : '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload syllabus');
      }

      // Success handling
      toast({
        title: "Success!",
        description: "Your syllabus has been uploaded successfully.",
        action: (
          <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="h-5 w-5 text-white animate-in zoom-in duration-300" />
          </div>
        ),
      });

      // Reset form and close modal
      setFormData(initialFormData);
      setIsOpen(false);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to upload syllabus. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to convert File to base64
  const fileToBase64 = (file: File | null): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve('');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Syllabus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Syllabus</DialogTitle>
          <DialogDescription>
            Share a syllabus with the community
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="school" className="text-sm font-medium mb-1 block">
              School
            </label>
            <Input
              id="school"
              placeholder="Enter school name"
              value={formData.school}
              onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
              required
            />
          </div>
          <div>
            <label htmlFor="class" className="text-sm font-medium mb-1 block">
              Class
            </label>
            <Input
              id="class"
              placeholder="Enter class name"
              value={formData.class}
              onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
              required
            />
          </div>
          <div>
            <label htmlFor="professor" className="text-sm font-medium mb-1 block">
              Professor
            </label>
            <Input
              id="professor"
              placeholder="Enter professor name"
              value={formData.professor}
              onChange={(e) => setFormData(prev => ({ ...prev, professor: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="semester" className="text-sm font-medium mb-1 block">
                Semester
              </label>
              <select
                id="semester"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={formData.semester}
                onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                required
              >
                <option value="">Select...</option>
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Winter">Winter</option>
              </select>
            </div>
            <div>
              <label htmlFor="year" className="text-sm font-medium mb-1 block">
                Year
              </label>
              <Input
                id="year"
                type="number"
                placeholder="YYYY"
                min="1900"
                max="2100"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium block">
              Syllabus Upload Method
            </label>
            <RadioGroup
              value={formData.uploadType}
              onValueChange={(value: 'text' | 'file') => 
                setFormData(prev => ({ ...prev, uploadType: value }))
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text">Enter Text</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="file" id="file" />
                <Label htmlFor="file">Upload File</Label>
              </div>
            </RadioGroup>

            {formData.uploadType === 'text' ? (
              <div>
                <label htmlFor="syllabusText" className="text-sm font-medium mb-1 block">
                  Syllabus Content
                </label>
                <Textarea
                  id="syllabusText"
                  placeholder="Enter your syllabus content here..."
                  value={formData.syllabusText}
                  onChange={(e) => setFormData(prev => ({ ...prev, syllabusText: e.target.value }))}
                  className="min-h-[200px]"
                  required={formData.uploadType === 'text'}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="syllabusFile" className="text-sm font-medium mb-1 block">
                  Syllabus File
                </label>
                <Input
                  id="syllabusFile"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required={formData.uploadType === 'file'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: PDF, DOC, DOCX
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? 'Uploading...' : 'Upload Syllabus'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}