"use client"

import styles from './Admin.module.css';
import AuthCheck from '../../../components/AuthCheck';
import PostFeed from '../../../components/PostFeed';
import { UserContext } from '../../../lib/context';
import { firestore, auth } from '../../../lib/firebase';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, setDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';

export default function AdminPostsPage() {
  return (
    <main>
      <AuthCheck>
        <PostList />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const uid = auth.currentUser?.uid;
  
  // Always call hooks at the top level
  const postsRef = uid ? collection(firestore, `users/${uid}/posts`) : null;
  const postsQuery = postsRef ? query(postsRef, orderBy('createdAt')) : null;
  const [querySnapshot, loading, error] = useCollection(postsQuery);
  
  if (!uid) {
    return <div>Please log in to manage your posts.</div>;
  }

  if (error) {
    return <div>Error loading posts: {error.message}</div>;
  }

  if (loading) {
    return <div>Loading your posts...</div>;
  }

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your Posts</h1>
      <CreateNewPost />
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid;
    
    if (!uid) {
      toast.error('You must be logged in to create a post');
      return;
    }

    const postsRef = collection(firestore, `users/${uid}/posts`);
    const postDoc = doc(postsRef, slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '## Write your post content here...\n\nStart writing your amazing content!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    try {
      await setDoc(postDoc, data);
      toast.success('Post created!')
      // Navigate to the admin post editor
      router.push(`/admin/${slug}`);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }

  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter Text Here"
        className={styles.input}
      />
      <p>
        <strong>Post Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}