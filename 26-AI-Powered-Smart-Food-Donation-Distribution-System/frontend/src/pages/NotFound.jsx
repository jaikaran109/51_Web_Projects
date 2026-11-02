import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="section-py flex-center" style={{ minHeight: '65vh', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        <div className="card card-glass" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍲</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>404</h1>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Page Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            The page or food listing you are looking for might have been moved or is no longer available.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/" className="btn btn-primary">
              <Home size={16} /> Return Home
            </Link>
            <Link to="/listings" className="btn btn-secondary">
              Explore Food
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
