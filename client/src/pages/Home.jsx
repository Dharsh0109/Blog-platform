import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import Spinner from '../components/Spinner';

export default function Home() {
  const { user } = useAuth();
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [page,    setPage]    = useState(1);
  const [pages,   setPages]   = useState(1);
  const [tab,     setTab]     = useState('all');

  const fetchPosts = async (p = 1) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/posts?page=${p}&limit=9`);
      setPosts(data.posts);
      setPages(data.pages);
      setPage(p);
    } catch {
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(1); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  const displayed = tab === 'mine'
    ? posts.filter((p) => p.author?.username === user?.username)
    : posts;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blog Posts</h1>
        {user && (
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => setTab('all')}
              className={`px-3 py-1.5 rounded-lg transition ${tab === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All Posts
            </button>
            <button
              onClick={() => setTab('mine')}
              className={`px-3 py-1.5 rounded-lg transition ${tab === 'mine' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              My Posts
            </button>
          </div>
        )}
      </div>

      {loading && <Spinner />}
      {error   && <div className="text-center py-20 text-red-500">{error}</div>}

      {!loading && !error && displayed.length === 0 && (
        <div className="text-center py-20 text-gray-400">No posts found.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayed.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            isAuthor={user?.username === post.author?.username}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {!loading && pages > 1 && tab === 'all' && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchPosts(p)}
              className={`w-9 h-9 rounded-lg text-sm transition ${p === page ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
