import { useState } from 'react';

export default function PostForm({ initial = {}, onSubmit, submitting }) {
  const [form, setForm] = useState({
    title:      initial.title      || '',
    content:    initial.content    || '',
    coverImage: initial.coverImage || '',
    tags:       initial.tags?.join(', ') || '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit({
        title:      form.title.trim(),
        content:    form.content.trim(),
        coverImage: form.coverImage.trim(),
        tags:       form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg
               || err.response?.data?.message
               || 'Something went wrong';
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          name="title" value={form.title} onChange={handleChange} required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
        <textarea
          name="content" value={form.content} onChange={handleChange} required rows={10}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
        <input
          name="coverImage" value={form.coverImage} onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags <span className="text-gray-400 font-normal">(comma-separated)</span></label>
        <input
          name="tags" value={form.tags} onChange={handleChange}
          placeholder="react, javascript, webdev"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit" disabled={submitting}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {submitting ? 'Saving…' : 'Save Post'}
      </button>
    </form>
  );
}
