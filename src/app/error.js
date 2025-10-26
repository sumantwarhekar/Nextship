"use client";
import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <main className="container">
      <div className="error-page">
        <h1>Something went wrong!</h1>
        <p>An error occurred while loading this page.</p>
        
        {error?.message && (
          <details className="error-details">
            <summary>Error Details</summary>
            <pre>{error.message}</pre>
          </details>
        )}
        
        <div className="error-actions">
          <button 
            onClick={() => reset()}
            className="btn-blue"
          >
            Try again
          </button>
          
          <Link href="/">
            <button className="btn-outline">Go home</button>
          </Link>
        </div>
        
        <iframe
          src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
          width="480"
          height="362"
          frameBorder="0"
          allowFullScreen
          title="Error animation"
        ></iframe>
      </div>
    </main>
  );
}