import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/"               element={<Home />} />
              <Route path="/register"       element={<Register />} />
              <Route path="/login"          element={<Login />} />
              <Route path="/posts/:id"      element={<PostDetail />} />
              <Route path="/create"         element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/posts/:id/edit" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
              <Route path="/404"            element={<NotFound />} />
              <Route path="*"              element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
