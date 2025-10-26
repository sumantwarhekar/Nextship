"use client";
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container">
      <div className="not-found-page">
        <h1>404 - Page Not Found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist.</p>
        
        <iframe
          src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
          width="480"
          height="362"
          frameBorder="0"
          allowFullScreen
          title="404 animation"
        ></iframe>
        
        <div className="actions">
          <Link href="/">
            <button className="btn-blue">Go home</button>
          </Link>
          
          <Link href="/blog">
            <button className="btn-outline">Browse posts</button>
          </Link>
        </div>
      </div>
    </main>
  );
}