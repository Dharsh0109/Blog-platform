import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function CommentItem({ comment, currentUser, postAuthorUsername, onDelete, onUpdate }) {
  const [editing,     setEditing]     = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [saving,      setSaving]      = useState(false);

  const isCommentAuthor = currentUser?.username === comment.author?.username;
  const isPostAuthor    = currentUser?.username === postAuthorUsername;

  const handleSave = async () => {
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.put(`/comments/${comment._id}`, { content: editContent });
      onUpdate(data);
      setEditing(false);
      toast.success('Comment updated');
    } catch {
      toast.error('Failed to update comment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{comment.author?.username}</span>
        <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>

      {editing ? (
        <div className="space-y-2 mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave} disabled={saving}
              className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => { setEditing(false); setEditContent(comment.content); }}
              className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600 whitespace-pre-wrap">{comment.content}</p>
      )}

      {!editing && (isCommentAuthor || isPostAuthor) && (
        <div className="flex gap-3 mt-2">
          {isCommentAuthor && (
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-indigo-500 hover:underline"
            >
              Edit
            </button>
          )}
          <button
            onClick={() => onDelete(comment._id)}
            className="text-xs text-red-400 hover:underline"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function CommentSection({ postId, postAuthorUsername }) {
  const { user } = useAuth();
  const [comments,  setComments]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/posts/${postId}/comments`);
        setComments(data);
      } catch {
        toast.error('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [postId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { content: newComment });
      setComments((prev) => [...prev, data]);
      setNewComment('');
      toast.success('Comment posted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const handleUpdate = (updated) => {
    setComments((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Comments <span className="text-gray-400 font-normal text-base">({comments.length})</span>
      </h2>

      {/* Add comment */}
      {user ? (
        <form onSubmit={handleAdd} className="mb-6 space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment…"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <button
            type="submit" disabled={submitting || !newComment.trim()}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {submitting ? 'Posting…' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="mb-6 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">Log in</Link> to leave a comment.
        </p>
      )}

      {/* Comment list */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUser={user}
              postAuthorUsername={postAuthorUsername}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
