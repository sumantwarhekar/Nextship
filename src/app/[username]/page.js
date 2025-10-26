import { getUserWithUsername, postToJSON, firestore } from '../../../lib/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import UserProfile from '../../../components/UserProfile';
import PostFeed from '../../../components/PostFeed';
import { notFound } from 'next/navigation';

async function getUserData(username) {
  try {
    const userDoc = await getUserWithUsername(username);

    if (!userDoc) {
      return null;
    }

    const userData = userDoc.data();
    
    // Ensure the user data includes the username for the profile component
    const userWithUsername = {
      ...userData,
      username: userData.username || username, // fallback to the URL username
    };
    
    let postsData = [];
    
    try {
      // Get user's posts from the correct path (temporarily without orderBy to avoid index requirement)
      const postsRef = collection(firestore, `users/${userDoc.id}/posts`);
      const postsQuery = query(
        postsRef,
        where('published', '==', true),
        limit(5)
      );
      const postsSnapshot = await getDocs(postsQuery);
      postsData = postsSnapshot.docs.map(postToJSON).filter(post => post !== null);
    } catch (postsError) {
      console.error('Error fetching posts (will continue with empty posts):', postsError);
      // Continue with empty posts array instead of failing completely
      postsData = [];
    }
    
    return { user: userWithUsername, posts: postsData };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { username } = await params;
  const data = await getUserData(username);

  if (!data) {
    return {
      title: 'User Not Found - NextShip',
      description: `User @${username} not found`,
    };
  }

  const { user } = data;
  const title = `@${username} - NextShip`;
  const description = user.displayName 
    ? `Check out posts by ${user.displayName} (@${username}) on NextShip`
    : `Check out posts by @${username} on NextShip`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `https://yoursite.com/${username}`,
      images: user.photoURL ? [
        {
          url: user.photoURL,
          width: 400,
          height: 400,
          alt: `${user.displayName || username} profile picture`,
        }
      ] : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: user.photoURL ? [user.photoURL] : [],
    },
  };
}

export default async function UserProfilePage({ params }) {
  try {
    const { username } = await params;
    
    const data = await getUserData(username);

    if (!data) {
      notFound();
    }

    const { user, posts } = data;

    return (
      <main>
        <UserProfile user={user} />
        <PostFeed posts={posts} />
      </main>
    );
  } catch (error) {
    console.error('💥 UserProfilePage: Unexpected error:', error);
    throw error; // Re-throw to trigger error boundary
  }
}