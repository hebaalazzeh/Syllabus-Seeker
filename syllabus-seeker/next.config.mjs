/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static image imports
  images: {
    domains: ['res.cloudinary.com'],
  },
  // Add environment variables that should be available at build time
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  }
}

export default nextConfig