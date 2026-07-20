import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import PostForm from './PostForm';
import Spinner from '../components/Spinner';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post,       setPost]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch {
        toast.error('Failed to load post');
        navigate('/');
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
      toast.success('Post updated!');
      navigate(`/posts/${id}`);
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg
               || err.response?.data?.message
               || 'Failed to update post';
      toast.error(msg);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Post</h1>
      <PostForm initial={post} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
