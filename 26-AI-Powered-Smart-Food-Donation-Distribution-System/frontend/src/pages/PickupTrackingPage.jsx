import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import PickupTimeline from '../components/pickups/PickupTimeline';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import {
  Truck,
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Gift,
} from 'lucide-react';

const PickupTrackingPage = () => {
  const { id } = useParams();
  const { user, role } = useAuth();

  const [pickup, setPickup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delivery Modal
  const [deliverModalOpen, setDeliverModalOpen] = useState(false);
  const [deliveryOtp, setDeliveryOtp] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPickup = async () => {
    try {
      const data = await api.get(`/pickups/${id}`);
      if (data.success) {
        setPickup(data.pickup);
        setDeliveryOtp(data.pickup.verificationOtp);
      }
    } catch (err) {
      setError(err.message || 'Failed to load tracking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickup();
  }, [id]);

  const handleAccept = async () => {
    try {
      const res = await api.put(`/pickups/${id}/accept`);
      if (res.success) {
        alert('Pickup claim accepted!');
        fetchPickup();
      }
    } catch (err) {
      alert(err.message || 'Failed to accept pickup');
    }
  };

  const handleMarkPickedUp = async () => {
    try {
      const res = await api.put(`/pickups/${id}/pickup`);
      if (res.success) {
        alert('Status updated: Food Picked Up and In Transit!');
        fetchPickup();
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDeliverSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.put(`/pickups/${id}/deliver`, {
        otp: deliveryOtp,
        deliveryNote,
      });
      if (res.success) {
        alert('Delivery confirmed & food verified!');
        setDeliverModalOpen(false);
        fetchPickup();
      }
    } catch (err) {
      alert(err.message || 'Failed to confirm delivery');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container section-py flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '2.5rem' }}>🚚</div>
        <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Loading live pickup tracking...</div>
      </div>
    );
  }

  if (error || !pickup) {
    return (
      <div className="container section-py flex-center" style={{ minHeight: '50vh', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2.5rem', maxWidth: '500px' }}>
          <AlertTriangle size={36} style={{ color: 'var(--rose-500)', margin: '0 auto 1rem auto' }} />
          <h2>Tracking Record Not Found</h2>
          <p style={{ margin: '0.5rem 0 1.5rem 0' }}>{error || 'Unable to locate this pickup claim record.'}</p>
          <Link to="/listings" className="btn btn-primary">
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const isDonorOwner = user?._id === pickup.donorId?._id;
  const isNgoOwner = user?._id === pickup.receiverId?._id;

  return (
    <div className="section-py">
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Back navigation */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to={role === 'donor' ? '/donor-dashboard' : role === 'receiver' ? '/receiver-dashboard' : '/listings'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
            }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        {/* Page Title */}
        <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div>
            <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
              Pickup Tracking #{pickup._id.slice(-6).toUpperCase()}
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
              {pickup.listingId?.title || 'Surplus Food Batch'}
            </h1>
          </div>

          {/* Handover OTP Box */}
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px dashed var(--primary-500)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.75rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Handover Verification OTP
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-500)', letterSpacing: '0.15em' }}>
              {pickup.verificationOtp}
            </div>
          </div>
        </div>

        {/* 4-Stage Lifecycle Stepper */}
        <PickupTimeline
          currentStatus={pickup.status}
          statusTimeline={pickup.statusTimeline}
          verificationOtp={pickup.verificationOtp}
          isOtpVerified={pickup.isOtpVerified}
        />

        {/* Operational Status Control Buttons */}
        <div className="card card-glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Lifecycle Actions
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {pickup.status === 'Pending' && (isDonorOwner || role === 'admin') && (
              <button onClick={handleAccept} className="btn btn-primary">
                <CheckCircle2 size={16} /> Accept Pickup Claim
              </button>
            )}

            {pickup.status === 'Accepted' && (isNgoOwner || role === 'admin') && (
              <button onClick={handleMarkPickedUp} className="btn btn-accent">
                <Truck size={16} /> Mark Food Collected (Picked Up)
              </button>
            )}

            {pickup.status === 'Picked Up' && (isNgoOwner || role === 'admin') && (
              <button onClick={() => setDeliverModalOpen(true)} className="btn btn-primary">
                <Gift size={16} /> Confirm Delivery to Beneficiaries
              </button>
            )}

            {pickup.status === 'Delivered' && (
              <div style={{ color: 'var(--primary-500)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={18} /> Delivery Lifecycle Completed & Verified!
              </div>
            )}
          </div>
        </div>

        {/* Donor & NGO Parties Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Donor Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Donor Organization
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <img
                src={pickup.donorId?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${pickup.donorId?.name}`}
                alt={pickup.donorId?.name}
                style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  {pickup.donorId?.organizationName || pickup.donorId?.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {pickup.donorId?.phone} • {pickup.donorId?.email}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--bg-muted)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
              <strong>Pickup Location: </strong>
              {pickup.donorId?.address?.street}, {pickup.donorId?.address?.city} - {pickup.donorId?.address?.pincode}
            </div>
          </div>

          {/* NGO Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Assigned NGO / Receiver
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <img
                src={pickup.receiverId?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${pickup.receiverId?.name}`}
                alt={pickup.receiverName}
                style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)' }}>
                  {pickup.receiverOrg || pickup.receiverName}
                  {pickup.receiverId?.isVerified && (
                    <ShieldCheck size={16} style={{ color: 'var(--primary-500)' }} />
                  )}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {pickup.receiverPhone} • {pickup.receiverId?.email}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--bg-muted)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
              <strong>Distribution Target: </strong>
              {pickup.targetBeneficiaryGroup} (~{pickup.estimatedBeneficiariesCount} individuals fed) • Vehicle: {pickup.transportMode}
            </div>
          </div>
        </div>
      </div>

      {/* Verify Delivery Modal */}
      <Modal
        isOpen={deliverModalOpen}
        onClose={() => setDeliverModalOpen(false)}
        title="Verify & Complete Food Delivery"
      >
        <form onSubmit={handleDeliverSubmit}>
          <div className="form-group">
            <label className="form-label">6-Digit Handover OTP</label>
            <input
              type="text"
              className="form-control"
              style={{ fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '0.1em' }}
              value={deliveryOtp}
              onChange={(e) => setDeliveryOtp(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Distribution Notes</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="e.g. Distributed 90 fresh meals to evening shelter residents."
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setDeliverModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <CheckCircle2 size={16} /> {submitting ? 'Verifying...' : 'Confirm Delivery Completion'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PickupTrackingPage;
