import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Spinner from '../components/Spinner';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch {
        setError('Post not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch {
      alert('Failed to delete post.');
    }
  };

  if (loading) return <Spinner />;
  if (error)   return <div className="text-center py-20 text-red-500">{error}</div>;

  const isAuthor = user?.username === post.author?.username;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover rounded-xl mb-6" />
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {post.tags?.map((tag) => (
          <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-3">{post.title}</h1>

      <div className="flex items-center justify-between text-sm text-gray-400 mb-8">
        <span>By <span className="font-medium text-gray-600">{post.author?.username}</span></span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
        {post.content}
      </div>

      {isAuthor && (
        <div className="flex gap-3 mt-10">
          <Link
            to={`/posts/${id}/edit`}
            className="px-4 py-2 border border-indigo-500 text-indigo-600 rounded-lg text-sm hover:bg-indigo-50 transition"
          >
            Edit Post
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-red-400 text-red-500 rounded-lg text-sm hover:bg-red-50 transition"
          >
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
}
