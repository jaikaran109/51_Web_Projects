import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/reviews/StarRating';
import {
  User,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  Heart,
  Truck,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    organizationName: user?.organizationName || '',
    organizationType: user?.organizationType || 'Restaurant',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    bio: user?.bio || '',
    operatingHours: user?.operatingHours || '9:00 AM - 9:00 PM',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        phone: formData.phone,
        bio: formData.bio,
        operatingHours: formData.operatingHours,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          formattedAddress: `${formData.street}, ${formData.city}`,
        },
      });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section-py">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
            Account Settings
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Organization & Profile</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage your public organization credentials, location, and verified badges.
          </p>
        </div>

        {/* Verification Status Card */}
        <div
          className="card card-glass"
          style={{
            padding: '1.75rem',
            marginBottom: '2rem',
            borderLeft: `5px solid ${user?.isVerified ? 'var(--primary-500)' : 'var(--amber-500)'}`,
          }}
        >
          <div className="flex-between">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  Verification Status: {user?.isVerified ? 'Verified Organization' : 'Pending Verification'}
                </h3>
                {user?.isVerified && (
                  <ShieldCheck size={18} style={{ color: 'var(--primary-500)' }} />
                )}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {user?.isVerified
                  ? 'Your organization is officially verified to participate in platform surplus food dispatch.'
                  : 'NGO verification is currently under review by Platform Administrators.'}
              </p>
            </div>
            <span className={`badge ${user?.isVerified ? 'badge-emerald' : 'badge-amber'}`}>
              {user?.verificationStatus || 'unsubmitted'}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Profile Details
          </h3>

          {successMsg && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid var(--primary-500)',
                color: 'var(--primary-500)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              ✓ {successMsg}
            </div>
          )}

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Contact Person Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Organization Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Organization Type</label>
              <select
                className="form-control"
                value={formData.organizationType}
                onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
              >
                <option value="Individual">Individual</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Caterer & Events">Caterer & Events</option>
                <option value="Bakery">Bakery</option>
                <option value="Supermarket / Grocery">Supermarket / Grocery</option>
                <option value="NGO / Non-Profit">NGO / Non-Profit</option>
                <option value="Food Bank">Food Bank</option>
                <option value="Shelter Home">Shelter Home</option>
                <option value="Community Kitchen">Community Kitchen</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone *</label>
              <input
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input
              type="text"
              className="form-control"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-control"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                className="form-control"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bio / Mission Statement</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={saving}
            >
              {saving ? 'Saving Updates...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
