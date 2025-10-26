"use client";

import { Component } from 'react';
import Link from 'next/link';

class EnterErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Enter page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main>
          <div>
            <h1>Authentication Error</h1>
            <p>There was an error loading the sign-in page.</p>
            <details>
              <summary>Error Details</summary>
              <pre>{this.state.error?.message || 'Unknown error'}</pre>
            </details>
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-blue"
            >
              Try Again
            </button>
            <Link href="/" className="btn-outline" style={{ marginLeft: '10px' }}>
              Go Home
            </Link>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default EnterErrorBoundary;