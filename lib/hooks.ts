import { auth, firestore } from './firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe: (() => void) | undefined;

    if (user) {
      setLoading(true);
      const ref = doc(firestore, 'users', user.uid);
      unsubscribe = onSnapshot(ref, (docSnap) => {
        setUsername(docSnap.data()?.username || null);
        setLoading(false);
      }, (error) => {
        console.error('Error loading user profile:', error);
        setLoading(false);
      });
    } else {
      setUsername(null);
      setLoading(false);
    }

    return unsubscribe;
  }, [user]);

  return { user, username, loading };
}