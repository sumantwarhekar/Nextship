"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import PostFeed from '../../components/PostFeed';
import Loader from '../../components/Loader';
import { firestore, postToJSON } from '../../lib/firebase';
import { collection, where, limit, getDocs, query } from 'firebase/firestore';

const LIMIT = 10;

// Client Component - fetches data after mount
interface Post {
  id?: string;
  title?: string;
  content?: string;
  published?: boolean;
  createdAt?: number | { toMillis?: () => number };
  updatedAt?: number | { toMillis?: () => number };
  [key: string]: unknown;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts().then(fetchedPosts => {
      setPosts(fetchedPosts);
      setLoading(false);
    });
  }, []);

  return (
    <main className="container">
      <div className="feed">
        <Loader show={loading} />
        
        {!loading && <PostFeed posts={posts} admin={false} />}

        {!loading && posts.length === 0 && (
          <div className="text-center">
            <p>No posts yet. Sign up and create the first post!</p>
            <Link href="/enter">
              <button className="btn-blue">Get Started</button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

async function getPosts() {
  try {
    // Get a list of users first
    const usersRef = collection(firestore, 'users');
    const usersSnapshot = await getDocs(query(usersRef, limit(10)));
    
    let allPosts: Post[] = [];
    
    // Fetch posts from each user
    for (const userDoc of usersSnapshot.docs) {
      try {
        const postsRef = collection(firestore, `users/${userDoc.id}/posts`);
        const postsQuery = query(
          postsRef,
          where('published', '==', true),
          limit(5)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const userPosts = postsSnapshot.docs.map(postToJSON).filter(post => post !== null);
        allPosts = allPosts.concat(userPosts);
      } catch {
        // Skip this user's posts if there's an error
      }
    }
    
    // Sort by creation date (newest first)
    allPosts.sort((a, b) => {
      const aTime = typeof a.createdAt === 'number' ? a.createdAt : a.createdAt?.toMillis?.() || 0;
      const bTime = typeof b.createdAt === 'number' ? b.createdAt : b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });
    
    return allPosts.slice(0, LIMIT);
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return empty array instead of failing
    return [];
  }
}