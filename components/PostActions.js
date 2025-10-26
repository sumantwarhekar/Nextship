"use client";

import { useContext } from 'react';
import { firestore } from '../lib/firebase';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { UserContext } from '../lib/context';
import HeartButton from './HeartButton';
import Link from 'next/link';

// Client component for post interactions (heart button, etc.)
export default function PostActions({ postPath }) {
  // Create the document reference on the client side
  const postRef = doc(firestore, postPath);
  const [realtimePost] = useDocumentData(postRef);
  const { user } = useContext(UserContext);

  // Fallback to post data from server render if realtime is not available yet
  const heartCount = realtimePost?.heartCount || 0;
  
  // Extract slug from postPath (format: users/{userId}/posts/{slug})
  const slug = postPath.split('/').pop();
  
  // Check if current user is the author
  const isAuthor = user && realtimePost && user.uid === realtimePost.uid;

  return (
    <div className="card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '1rem', 
      padding: '1.5rem 1rem', 
      height: 'fit-content',
      position: 'sticky',
      top: '2rem',
      minWidth: '160px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '1.2rem' }}>
          <strong>{heartCount} 💗</strong>
        </p>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--color-gray)' }}>
          {heartCount === 1 ? 'heart' : 'hearts'}
        </p>
      </div>
      
      <HeartButton postRef={postRef} />
      
      {isAuthor && (
        <Link href={`/admin/${slug}`} style={{ width: '100%' }}>
          <button className="btn-blue" style={{ 
            width: '100%', 
            padding: '0.75rem 1rem', 
            fontSize: '0.9rem',
            margin: 0
          }}>
            Edit Post
          </button>
        </Link>
      )}

    </div>
  );
}
