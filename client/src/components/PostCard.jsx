import { Link } from 'react-router-dom';

export default function PostCard({ post, onDelete, isAuthor }) {
  const excerpt = post.content.length > 150 ? post.content.slice(0, 150) + '…' : post.content;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1 mb-2">
          {post.tags?.map((tag) => (
            <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
        <Link to={`/posts/${post._id}`}>
          <h2 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition mb-1">{post.title}</h2>
        </Link>
        <p className="text-sm text-gray-500 flex-1">{excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>By <span className="font-medium text-gray-600">{post.author?.username}</span></span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        {isAuthor && (
          <div className="mt-3 flex gap-2">
            <Link
              to={`/posts/${post._id}/edit`}
              className="flex-1 text-center text-xs border border-indigo-500 text-indigo-600 py-1 rounded-lg hover:bg-indigo-50 transition"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(post._id)}
              className="flex-1 text-xs border border-red-400 text-red-500 py-1 rounded-lg hover:bg-red-50 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
