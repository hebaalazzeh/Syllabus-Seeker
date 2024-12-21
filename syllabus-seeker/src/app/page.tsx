import SearchInterface from '@/components/SearchInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Syllabus Seeker
          </h1>
          <p className="text-gray-600 mt-2">
            Find and share course syllabi across universities
          </p>
        </div>
        <SearchInterface />
      </div>
    </main>
  );
}