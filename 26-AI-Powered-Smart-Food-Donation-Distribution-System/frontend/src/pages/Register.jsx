import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Heart, Truck, AlertCircle, ShieldCheck } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('donor'); // 'donor' or 'receiver'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organizationName: '',
    organizationType: 'Restaurant',
    phone: '',
    street: '',
    city: 'Metro Central',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        organizationName: formData.organizationName || `${formData.name}'s Kitchen`,
        organizationType: formData.organizationType,
        phone: formData.phone || '+1 555-0199',
        address: {
          street: formData.street || 'Main Street',
          city: formData.city || 'Metro Central',
          state: 'Metro',
          pincode: '100001',
          formattedAddress: `${formData.street || 'Main Street'}, ${formData.city || 'Metro Central'}`,
        },
      };

      const res = await register(payload);
      if (res.user.role === 'donor') navigate('/donor-dashboard');
      else if (res.user.role === 'receiver') navigate('/receiver-dashboard');
      else navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-py flex-center" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '620px' }}>
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
              🤝
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Join the Food Network</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Register as a Food Donor or Verified Relief NGO
            </p>
          </div>

          {/* Role Switcher */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div
              onClick={() => {
                setRole('donor');
                setFormData((prev) => ({ ...prev, organizationType: 'Restaurant' }));
              }}
              style={{
                border: role === 'donor' ? '2px solid var(--primary-500)' : '1px solid var(--border-subtle)',
                background: role === 'donor' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-main)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <Heart size={28} style={{ color: role === 'donor' ? 'var(--primary-500)' : 'var(--text-dim)', margin: '0 auto 0.5rem auto' }} />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: role === 'donor' ? 'var(--primary-500)' : 'var(--text-main)' }}>
                Food Donor
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Restaurant, Caterer, Supermarket
              </div>
            </div>

            <div
              onClick={() => {
                setRole('receiver');
                setFormData((prev) => ({ ...prev, organizationType: 'NGO / Non-Profit' }));
              }}
              style={{
                border: role === 'receiver' ? '2px solid var(--accent-500)' : '1px solid var(--border-subtle)',
                background: role === 'receiver' ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-main)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <Truck size={28} style={{ color: role === 'receiver' ? 'var(--accent-500)' : 'var(--text-dim)', margin: '0 auto 0.5rem auto' }} />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: role === 'receiver' ? 'var(--accent-500)' : 'var(--text-main)' }}>
                NGO / Receiver
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Charity, Shelter, Food Bank
              </div>
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

          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Marcus Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="contact@organization.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Organization Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={role === 'donor' ? 'Grand Horizon Banquets' : 'Food For All Relief Foundation'}
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Organization Type</label>
                <select
                  className="form-control"
                  value={formData.organizationType}
                  onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                >
                  {role === 'donor' ? (
                    <>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Caterer & Events">Caterer & Events</option>
                      <option value="Bakery">Bakery</option>
                      <option value="Supermarket / Grocery">Supermarket / Grocery</option>
                      <option value="Individual">Individual</option>
                    </>
                  ) : (
                    <>
                      <option value="NGO / Non-Profit">NGO / Non-Profit</option>
                      <option value="Food Bank">Food Bank</option>
                      <option value="Shelter Home">Shelter Home</option>
                      <option value="Community Kitchen">Community Kitchen</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+1 555-0199"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="45 Royale Plaza, 5th Avenue"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password * (6+ characters)</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                minLength="6"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.75rem' }}
              disabled={loading}
            >
              <UserPlus size={18} /> {loading ? 'Registering Account...' : 'Complete Registration'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--primary-500)', fontWeight: 700 }}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
