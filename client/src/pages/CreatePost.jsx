import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PostForm from './PostForm';

export default function CreatePost() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      const { data: post } = await api.post('/posts', data);
      navigate(`/posts/${post._id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Post</h1>
      <PostForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
