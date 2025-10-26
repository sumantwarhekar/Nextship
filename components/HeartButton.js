import { useAuthState } from 'react-firebase-hooks/auth';
import { firestore, auth } from '../lib/firebase';
import { doc, writeBatch, increment, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

// Allows user to heart or like a post
export default function HeartButton({ postRef }) {
  const [user] = useAuthState(auth);
  const [isHearted, setIsHearted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user has hearted this post
  useEffect(() => {
    const checkHeartStatus = async () => {
      if (!user || !postRef || !postRef.path) return;
      
      try {
        const heartRef = doc(firestore, postRef.path, 'hearts', user.uid);
        const heartDoc = await getDoc(heartRef);
        setIsHearted(heartDoc.exists());
      } catch {
        // Don't throw error, just assume not hearted
        setIsHearted(false);
      }
    };

    checkHeartStatus();
  }, [user, postRef]);

  // Create a user-to-post relationship
  const addHeart = async () => {
    if (!user || loading || !postRef || !postRef.path) return;
    
    setLoading(true);
    try {
      const uid = user.uid;
      const batch = writeBatch(firestore);
      const heartRef = doc(firestore, postRef.path, 'hearts', user.uid);

      batch.set(heartRef, { uid });
      batch.update(postRef, { heartCount: increment(1) });

      await batch.commit();
      setIsHearted(true);
    } catch (err) {
      console.error('Error adding heart:', err);
      // Don't show error to user, just fail silently
    } finally {
      setLoading(false);
    }
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    if (!user || loading || !postRef || !postRef.path) return;
    
    setLoading(true);
    try {
      const batch = writeBatch(firestore);
      const heartRef = doc(firestore, postRef.path, 'hearts', user.uid);

      batch.update(postRef, { heartCount: increment(-1) });
      batch.delete(heartRef);

      await batch.commit();
      setIsHearted(false);
    } catch (err) {
      console.error('Error removing heart:', err);
      // Don't show error to user, just fail silently
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Don't render anything if not authenticated
  }

  return isHearted ? (
    <button 
      onClick={removeHeart} 
      className="btn-outline"
      disabled={loading}
    >
      💔 Unheart
    </button>
  ) : (
    <button 
      onClick={addHeart} 
      className="btn-red"
      disabled={loading}
    >
      💗 Heart
    </button>
  );
}