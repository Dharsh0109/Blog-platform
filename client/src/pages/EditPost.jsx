import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import PostForm from './PostForm';
import Spinner from '../components/Spinner';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post,       setPost]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch {
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.put(`/posts/${id}`, data);
      navigate(`/posts/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (error)   return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Post</h1>
      <PostForm initial={post} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
