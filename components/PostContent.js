import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

// UI component for main post content
export default function PostContent({ post }) {
  if (!post) {
    return <div className="card">Post not found</div>;
  }

  let createdAt;
  try {
    createdAt = typeof post.createdAt === 'number' 
      ? new Date(post.createdAt) 
      : post.createdAt?.toDate ? post.createdAt.toDate() : new Date();
  } catch {
    createdAt = new Date();
  }

  return (
    <div className="card">
      <h1>{post.title || 'Untitled'}</h1>
      <span className="text-sm">
        Written by{' '}
        <Link href={`/${post.username || 'unknown'}/`}>
          <span className="text-info">@{post.username || 'unknown'}</span>
        </Link>{' '}
        on {createdAt.toLocaleDateString()}
      </span>
      <ReactMarkdown>{post.content || 'No content available'}</ReactMarkdown>
    </div>
  );
}