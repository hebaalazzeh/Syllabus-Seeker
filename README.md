# Syllabus Seeker

Link to site: https://syllabus-seeker.vercel.app/

A modern web application that allows students to search, share, and access course syllabi from their schools. Built with Next.js, TypeScript, and Prisma.

## 👩‍💻 Author

Created by Heba Alazzeh

## 🌟 Features

- **Search Functionality**
  - Search by school name
  - Search by course code or name
  - Search by professor name
  - Filter by year
  - Fuzzy search capabilities

- **Syllabus Management**
  - Upload syllabi as files (PDF, DOC, DOCX)
  - Text-based syllabus submissions
  - File preview functionality
  - Download options for syllabi

- **User Interface**
  - Clean, modern design
  - Dark/Light mode toggle
  - Responsive layout
  - Intuitive navigation

## 🛠 Tech Stack

- **Frontend**
  - Next.js 14
  - TypeScript
  - TailwindCSS
  - Lucide Icons
  - React Dropzone

- **Backend**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL (Neon)

- **Infrastructure**
  - Vercel Deployment
  - Neon Database

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/syllabus-seeker.git
cd syllabus-seeker
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory and add:
```env
DATABASE_URL="your-postgres-url"
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📝 Database Schema

The application uses the following data models:

- **School**
  - Name
  - Courses

- **Course**
  - Course Code
  - Name
  - School Reference
  - Professor Reference
  - Syllabi

- **Professor**
  - Name
  - Courses
  - Syllabi
  - Ratings

- **Syllabus**
  - Year
  - Term
  - File URL
  - Text Content
  - Course Reference
  - Professor Reference
  - Ratings

## 🔄 API Routes

- `GET /api/search` - Search syllabi with filters
- `POST /api/upload` - Upload new syllabus
- `POST /api/upload-file` - Handle file uploads

## 🎨 UI Components

- SearchForm - Main search interface
- UploadModal - Syllabus upload form
- PreviewModal - Syllabus preview/download
- ThemeToggle - Dark/Light mode switcher

## 🚀 Deployment

The application is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📈 Future Enhancements

- User authentication
- Rating system for syllabi
- Comment/discussion features
- Advanced search filters
- Bulk upload functionality
- Email notifications
- Analytics dashboard


## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- Neon for database hosting
- All contributors and users of the application