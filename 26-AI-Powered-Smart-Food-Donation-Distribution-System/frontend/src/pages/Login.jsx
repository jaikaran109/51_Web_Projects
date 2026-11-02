import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Heart, Truck } from 'lucide-react';

const Login = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectAfterLogin = (role) => {
    const from = location.state?.from?.pathname;
    if (from) {
      navigate(from);
      return;
    }
    if (role === 'donor') navigate('/donor-dashboard');
    else if (role === 'receiver') navigate('/receiver-dashboard');
    else if (role === 'admin') navigate('/admin-dashboard');
    else navigate('/');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await login(email, password);
      redirectAfterLogin(res.user.role);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await demoLogin(role);
      redirectAfterLogin(res.user.role);
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-py flex-center" style={{ minHeight: '75vh' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="card card-glass" style={{ padding: '2.5rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                fontSize: '1.5rem',
              }}
            >
              🍲
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome Back</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Sign in to manage food donations and pickup operations
            </p>
          </div>

          {/* Quick Demo Buttons for Instant Testing */}
          <div
            style={{
              background: 'var(--bg-main)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem', textAlign: 'center' }}>
              ⚡ 1-Click Evaluation Accounts
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleDemoClick('donor')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.2rem', borderColor: '#10b981' }}
              >
                👨‍🍳 Donor
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('receiver')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.2rem', borderColor: '#6366f1' }}
              >
                🚐 NGO
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('admin')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.2rem', borderColor: '#f43f5e' }}
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          {errorMsg && (
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: 'var(--rose-500)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@organization.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              <LogIn size={18} /> {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--primary-500)', fontWeight: 700 }}>
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
