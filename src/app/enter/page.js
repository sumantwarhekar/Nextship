"use client";

import { auth, firestore, googleAuthProvider } from '../../../lib/firebase';
import { useContext, useState, useEffect, useCallback } from 'react';
import { UserContext } from '../../../lib/context';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Enter() {
    const { user, username, loading: profileLoading } = useContext(UserContext);
    const [, authLoading, error] = useAuthState(auth);

    // Show loading state while Firebase is initializing or profile is loading
    if (authLoading || profileLoading) {
      return (
        <main>
          <div>
            <h1>Loading...</h1>
            <p>Please wait while we load your profile.</p>
          </div>
        </main>
      );
    }

    // Show error state if there's an auth error
    if (error) {
      console.error('Auth error:', error);
      return (
        <main>
          <div>
            <h1>Authentication Error</h1>
            <p>There was an error loading your authentication state.</p>
            <button onClick={() => window.location.reload()}>Reload Page</button>
          </div>
        </main>
      );
    }

    return (
      <main>
        {user ? (
          <div>
            <h1>Welcome!</h1>
            <p>Logged in as: {user.email || 'User'}</p>
            {!username ? <UsernameForm /> : <p>Username: {username}</p>}
            <SignOutButton />
          </div>
        ) : (
          <SignInButton />
        )}
      </main>
    );
}

function SignInButton() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const signInWithGoogle = async () => {
    if (isSigningIn) return;
    
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error('Sign-in error:', error);
      alert('Failed to sign in. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <button 
      className="btn-google" 
      onClick={signInWithGoogle}
      disabled={isSigningIn}
    >
      <Image src="/google.png" alt="Google logo" width={20} height={20} style={{ display: 'inline', marginRight: '8px' }} /> 
      {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
    </button>
  );
}

function SignOutButton() {
  const router = useRouter();
  
  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };
  
  return <button onClick={handleSignOut}>Sign Out</button>;
}

function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { user, username } = useContext(UserContext);

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback((username) => {
    const debouncedCheck = debounce(async (usernameToCheck) => {
      if (usernameToCheck.length >= 3) {
        const ref = doc(firestore, 'usernames', usernameToCheck);
        const docSnap = await getDoc(ref);

        
        // Check if username is available OR if current user already owns it
        const isAvailable = !docSnap.exists();
        const isOwnedByCurrentUser = docSnap.exists() && docSnap.data()?.uid === user?.uid;
        
        setIsValid(isAvailable || isOwnedByCurrentUser);
        setLoading(false);
      }
    }, 500);
    
    debouncedCheck(username);
  }, [user]);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue, checkUsername]);

  // Don't render if user is not loaded yet or doesn't have uid
  if (!user || !user.uid) {
    return <div>Loading user data...</div>;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValid || submitting || !user.uid) return;
    
    setSubmitting(true);

    try {
      // Create refs for both documents
      const userDocRef = doc(firestore, 'users', user.uid);
      const usernameDocRef = doc(firestore, 'usernames', formValue);

      // Commit both docs together as a batch write.
      const batch = writeBatch(firestore);
      batch.set(userDocRef, { 
        username: formValue, 
        photoURL: user.photoURL || null, 
        displayName: user.displayName || null 
      });
      batch.set(usernameDocRef, { uid: user.uid });

      await batch.commit();
      
      // The UserContext should automatically update via the real-time listener
      // Give it a moment to update
      setTimeout(() => {
        setSubmitting(false);
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error setting username:', error);
      
      // Check if it's a permissions error
      if (error.code === 'permission-denied') {
        alert('Permission denied. Please make sure Firestore security rules are updated in Firebase Console.\n\nGo to: Firebase Console → Firestore Database → Rules → Publish the updated rules from firestore.rules file.');
      } else {
        alert('Failed to set username. Please try again.\n\nError: ' + error.message);
      }
      
      setSubmitting(false);
    }
  };

  return (
    !username && (
      <section>
        <h3>Choose Username:</h3>
        <form onSubmit={onSubmit}>
          <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          <button type="submit" className="btn-green" disabled={!isValid || submitting}>
            {submitting ? 'Setting username...' : 'Choose'}
          </button>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}