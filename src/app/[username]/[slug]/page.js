import styles from './Post.module.css';
import PostContent from '../../../../components/PostContent';
import PostActions from '../../../../components/PostActions';
import { firestore, getUserWithUsername, postToJSON } from '../../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';

// Generate dynamic metadata for each post
export async function generateMetadata({ params }) {
  const { username, slug } = await params;
  
  try {
    const userDoc = await getUserWithUsername(username);
    if (!userDoc) return { title: 'User not found' };
    
    const postRef = doc(firestore, 'users', userDoc.id, 'posts', slug);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      return { title: 'Post not found' };
    }
    
    const post = postToJSON(postSnap);
    
    if (!post) {
      return { title: 'Post not found' };
    }
    
    return {
      title: `${post.title} | NextShip`,
      description: post.content?.substring(0, 160) || `A post by @${username}`,
      authors: [{ name: `@${username}` }],
      keywords: ['nextjs', 'firebase', 'blog', username],
      openGraph: {
        title: post.title,
        description: post.content?.substring(0, 160),
        type: 'article',
        authors: [`@${username}`],
        publishedTime: new Date(post.createdAt).toISOString(),
        images: [
          {
            url: '/og-image.png', // Add your default OG image
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.content?.substring(0, 160),
        creator: `@${username}`,
      },
    };
  } catch {
    return { title: 'NextShip' };
  }
}

export default async function PostPage({ params }) {
  const { username, slug } = await params;
  
  // Get user document first
  const userDoc = await getUserWithUsername(username);
  if (!userDoc) {
    notFound();
  }
  
  // Get the specific post from user's posts subcollection
  const postRef = doc(firestore, 'users', userDoc.id, 'posts', slug);
  const postSnap = await getDoc(postRef);
  
  if (!postSnap.exists()) {
    notFound();
  }
  
  const post = postToJSON(postSnap);
  
  if (!post) {
    notFound();
  }
  
  const postPath = `users/${userDoc.id}/posts/${slug}`;

  return (
    <main className={styles.container}>
      <div className={styles.postLayout}>
        <section className={styles.postContent}>
          <PostContent post={post} />
        </section>
        
        <aside className={styles.postSidebar}>
          <PostActions postPath={postPath} />
        </aside>
      </div>
    </main>
  );
}
