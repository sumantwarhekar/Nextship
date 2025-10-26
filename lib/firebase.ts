import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, query, where, limit, getDocs, Timestamp, serverTimestamp, increment, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDwB3p6uCSfy1m1q97GiVxCo9bKau97zYg",
    authDomain: "nextship-9a064.firebaseapp.com",
    projectId: "nextship-9a064",
    storageBucket: "nextship-9a064.firebasestorage.app",
    messagingSenderId: "846246146238",
    appId: "1:846246146238:web:427949d669a3dfc9e42eef",
    measurementId: "G-X4C55839FJ"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const googleAuthProvider = new GoogleAuthProvider();
export { serverTimestamp, increment };


/**
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username: string) {
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, where('username', '==', username), limit(1));
  const querySnapshot = await getDocs(q);
  const userDoc = querySnapshot.docs[0];
  return userDoc;
}

/**
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot | QueryDocumentSnapshot} doc
 */
export function postToJSON(doc: DocumentSnapshot | QueryDocumentSnapshot): Record<string, unknown> | null {
  const data = doc.data();
  
  if (!data) {
    return null;
  }
  
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt,
    updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : data.updatedAt,
  };
}

export const fromMillis = Timestamp.fromMillis;
