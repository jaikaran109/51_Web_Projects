import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatCard from '../components/common/StatCard';
import ListingCard from '../components/listings/ListingCard';
import PickupTimeline from '../components/pickups/PickupTimeline';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import {
  Truck,
  Users,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Gift,
  Layers,
  Clock,
} from 'lucide-react';

const ReceiverDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [myClaims, setMyClaims] = useState([]);
  const [nearbyListings, setNearbyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active-pickups'); // 'active-pickups', 'available-feed', 'history'

  // Deliver Modal State
  const [deliverModalOpen, setDeliverModalOpen] = useState(false);
  const [selectedPickupToDeliver, setSelectedPickupToDeliver] = useState(null);
  const [deliveryOtp, setDeliveryOtp] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [submittingDelivery, setSubmittingDelivery] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, claimsRes, listingsRes] = await Promise.all([
        api.get('/analytics/ngo'),
        api.get('/pickups/my-pickups'),
        api.get('/listings?status=Available&limit=6'),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (claimsRes.success) setMyClaims(claimsRes.pickups || []);
      if (listingsRes.success) setNearbyListings(listingsRes.listings || []);
    } catch (err) {
      console.warn('NGO dashboard data failed to load:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkPickedUp = async (pickupId) => {
    try {
      const res = await api.put(`/pickups/${pickupId}/pickup`);
      if (res.success) {
        alert('Food collected! Status updated to In Transit.');
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to update pickup status');
    }
  };

  const handleDeliverSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPickupToDeliver) return;
    setSubmittingDelivery(true);
    try {
      const res = await api.put(`/pickups/${selectedPickupToDeliver._id}/deliver`, {
        otp: deliveryOtp,
        deliveryNote,
      });

      if (res.success) {
        alert('Delivery verified & completed! Thank you for nourishing the community.');
        setDeliverModalOpen(false);
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to complete delivery');
    } finally {
      setSubmittingDelivery(false);
    }
  };

  const activePickupsList = myClaims.filter((p) => p.status === 'Pending' || p.status === 'Accepted' || p.status === 'Picked Up');
  const historyList = myClaims.filter((p) => p.status === 'Delivered' || p.status === 'Cancelled');

  return (
    <div className="section-py">
      <div className="container">
        {/* NGO Profile Header */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`}
              alt={user?.name}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--accent)',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                  {user?.organizationName || user?.name}
                </h1>
                {user?.isVerified ? (
                  <span className="badge badge-emerald">
                    <ShieldCheck size={11} /> Verified Relief NGO
                  </span>
                ) : (
                  <span className="badge badge-amber">Verification Pending</span>
                )}
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {user?.organizationType || 'Relief Agency'} • {user?.address?.city || 'Metro Central'} • {user?.phone}
              </p>
            </div>
          </div>

          <Link to="/listings" className="btn btn-accent">
            <Layers size={16} /> Browse Food Available to Claim
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          <StatCard
            title="Meals Distributed"
            value={stats?.mealsDistributed || user?.metrics?.totalMealsSaved || 0}
            subtitle="Delivered to beneficiaries"
            icon={Heart}
            color="emerald"
          />
          <StatCard
            title="Surplus Rescued"
            value={stats?.kgDistributed || user?.metrics?.totalDonatedKg || 0}
            suffix=" kg"
            subtitle="Collected from donors"
            icon={Truck}
            color="indigo"
          />
          <StatCard
            title="Active In Transit"
            value={stats?.inTransitCount || activePickupsList.length || 0}
            subtitle="Pickups in progress"
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Completed Rescues"
            value={stats?.deliveredCount || user?.metrics?.totalPickupsCompleted || 0}
            subtitle="Verified food handovers"
            icon={CheckCircle2}
            color="cyan"
          />
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem',
          }}
        >
          <button
            onClick={() => setActiveTab('active-pickups')}
            style={{
              padding: '0.65rem 1.25rem',
              fontWeight: 600,
              fontSize: '0.88rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'active-pickups' ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'active-pickups' ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: '-1px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Truck size={15} /> Active Claims ({activePickupsList.length})
          </button>

          <button
            onClick={() => setActiveTab('available-feed')}
            style={{
              padding: '0.65rem 1.25rem',
              fontWeight: 600,
              fontSize: '0.88rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'available-feed' ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'available-feed' ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            Nearby Surplus Food ({nearbyListings.length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '0.65rem 1.25rem',
              fontWeight: 600,
              fontSize: '0.88rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'history' ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'history' ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            History ({historyList.length})
          </button>
        </div>

        {/* TAB 1: ACTIVE CLAIMS */}
        {activeTab === 'active-pickups' && (
          <div>
            {activePickupsList.length === 0 ? (
              <div className="card flex-center" style={{ minHeight: '180px', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
                <Truck size={32} style={{ color: 'var(--text-dim)' }} />
                <h3 style={{ fontSize: '1.05rem' }}>No active pickups in progress</h3>
                <Link to="/listings" className="btn btn-primary btn-sm">
                  Browse Surplus Food
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {activePickupsList.map((pickup) => (
                  <div key={pickup._id} className="card" style={{ padding: '1.5rem' }}>
                    <div className="flex-between" style={{ marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                            {pickup.listingId?.title || 'Surplus Food Batch'}
                          </h3>
                          <span className={`badge ${pickup.status === 'Accepted' ? 'badge-indigo' : pickup.status === 'Picked Up' ? 'badge-cyan' : 'badge-amber'}`}>
                            {pickup.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Donor: <strong>{pickup.donorId?.organizationName || pickup.donorId?.name}</strong> • {pickup.donorId?.phone}
                        </div>
                      </div>

                      {/* OTP Tag */}
                      <div
                        style={{
                          background: 'var(--primary-light)',
                          padding: '0.4rem 0.85rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px dashed var(--primary-border)',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>OTP</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                          {pickup.verificationOtp}
                        </div>
                      </div>
                    </div>

                    <PickupTimeline
                      currentStatus={pickup.status}
                      statusTimeline={pickup.statusTimeline}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <Link to={`/tracking/${pickup._id}`} className="btn btn-secondary btn-sm">
                        <Eye size={14} /> Full Tracking View
                      </Link>

                      {pickup.status === 'Accepted' && (
                        <button
                          onClick={() => handleMarkPickedUp(pickup._id)}
                          className="btn btn-accent btn-sm"
                        >
                          <Truck size={14} /> Mark Food Collected
                        </button>
                      )}

                      {pickup.status === 'Picked Up' && (
                        <button
                          onClick={() => {
                            setSelectedPickupToDeliver(pickup);
                            setDeliveryOtp(pickup.verificationOtp);
                            setDeliverModalOpen(true);
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          <Gift size={14} /> Complete Delivery
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AVAILABLE FEED */}
        {activeTab === 'available-feed' && (
          <div className="grid-3">
            {nearbyListings.map((item) => (
              <ListingCard key={item._id} listing={item} />
            ))}
          </div>
        )}

        {/* TAB 3: HISTORY */}
        {activeTab === 'history' && (
          <div>
            {historyList.length === 0 ? (
              <div className="card flex-center" style={{ minHeight: '160px' }}>
                <p style={{ fontSize: '0.88rem' }}>No completed delivery lifecycles recorded yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {historyList.map((item) => (
                  <div key={item._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', padding: '1rem 1.25rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                        {item.listingId?.title || 'Surplus Food Batch'}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        Distributed to <strong>{item.targetBeneficiaryGroup}</strong> (~{item.estimatedBeneficiariesCount} people served)
                      </div>
                    </div>

                    <Link to={`/tracking/${item._id}`} className="btn btn-secondary btn-sm">
                      Audit Trail
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Complete Delivery Modal */}
      <Modal
        isOpen={deliverModalOpen}
        onClose={() => setDeliverModalOpen(false)}
        title="Verify & Complete Food Delivery"
      >
        {selectedPickupToDeliver && (
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
              <label className="form-label">Delivery Notes</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="e.g. Distributed 90 fresh meals to evening shelter residents."
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setDeliverModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingDelivery}
              >
                <CheckCircle2 size={15} /> Confirm Completion
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ReceiverDashboard;
