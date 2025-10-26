"use client";

import SafeImage from './SafeImage';

// UI component for user profile
export default function UserProfile({ user }) {
  if (!user) {
    return (
      <div className="box-center">
        <p>Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="box-center">
      <SafeImage 
        src={user?.photoURL} 
        className="card-img-center" 
        alt={`${user?.username || 'User'} avatar`}
        width={150}
        height={150}
      />
      <p>
        <i>@{user?.username}</i>
      </p>
      <h1>{user?.displayName || 'Anonymous User'}</h1>
    </div>
  );
}