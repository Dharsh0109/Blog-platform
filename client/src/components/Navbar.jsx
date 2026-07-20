import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-indigo-600">BlogPlatform</Link>
      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <Link to="/create" className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition">
              New Post
            </Link>
            <span className="text-gray-600">Hi, <span className="font-medium">{user.username}</span></span>
            <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    className="text-gray-600 hover:text-indigo-600">Login</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
