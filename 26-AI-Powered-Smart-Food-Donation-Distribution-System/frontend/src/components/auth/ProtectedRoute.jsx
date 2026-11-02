import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '2.5rem' }}>🍲</div>
        <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading secure session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="container section-py flex-center" style={{ minHeight: '50vh', flexDirection: 'column', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', padding: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Access Restricted</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Your account role (<strong>{user.role}</strong>) does not have authorization to view this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
