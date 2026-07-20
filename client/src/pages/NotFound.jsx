import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-indigo-200 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page not found</h2>
        <p className="text-gray-400 text-sm mb-8">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
