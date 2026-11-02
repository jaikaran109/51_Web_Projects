import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatCard from '../components/common/StatCard';
import FreshnessBadge from '../components/listings/FreshnessBadge';
import StarRating from '../components/reviews/StarRating';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  PlusCircle,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Eye,
  Sparkles,
} from 'lucide-react';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [myDonations, setMyDonations] = useState([]);
  const [myPickups, setMyPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming', 'active', 'history'

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, donationsRes, pickupsRes] = await Promise.all([
        api.get('/analytics/donor'),
        api.get('/listings/my-donations'),
        api.get('/pickups/my-pickups'),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (donationsRes.success) setMyDonations(donationsRes.listings || []);
      if (pickupsRes.success) setMyPickups(pickupsRes.pickups || []);
    } catch (err) {
      console.warn('Donor dashboard data load failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAcceptPickup = async (pickupId) => {
    try {
      const res = await api.put(`/pickups/${pickupId}/accept`);
      if (res.success) {
        alert('Pickup claim accepted! The NGO has been notified to proceed with collection.');
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to accept pickup');
    }
  };

  const incomingRequests = myPickups.filter((p) => p.status === 'Pending');
  const activeDonationsList = myDonations.filter((d) => d.status === 'Available' || d.status === 'Requested' || d.status === 'Accepted');
  const historyList = myPickups.filter((p) => p.status === 'Delivered' || p.status === 'Cancelled');

  return (
    <div className="section-py">
      <div className="container">
        {/* Profile Card */}
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
                border: '2px solid var(--primary)',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                  {user?.organizationName || user?.name}
                </h1>
                {user?.isVerified && (
                  <span className="badge badge-emerald">
                    <ShieldCheck size={11} /> Verified Donor
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {user?.organizationType || 'Food Donor'} • {user?.address?.city || 'Metro Central'} • {user?.phone}
              </p>
              <div style={{ marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <StarRating rating={user?.metrics?.rating || 5} size={13} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  ({user?.metrics?.reviewCount || 0} reviews)
                </span>
              </div>
            </div>
          </div>

          <Link to="/create-listing" className="btn btn-primary">
            <PlusCircle size={16} /> Donate Surplus Food
          </Link>
        </div>

        {/* Impact Stats */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          <StatCard
            title="Total Meals Donated"
            value={stats?.mealsSaved || user?.metrics?.totalMealsSaved || 0}
            subtitle="Fed hungry individuals"
            icon={Heart}
            color="emerald"
          />
          <StatCard
            title="Surplus Rescued"
            value={stats?.kgDonated || user?.metrics?.totalDonatedKg || 0}
            suffix=" kg"
            subtitle="Redirected from waste"
            icon={CheckCircle2}
            color="indigo"
          />
          <StatCard
            title="CO2 Offset"
            value={stats?.co2Saved || 0}
            suffix=" kg"
            subtitle="Carbon emissions saved"
            icon={ShieldCheck}
            color="amber"
          />
          <StatCard
            title="Active Listings"
            value={stats?.activeDonations || 0}
            subtitle="Available in network"
            icon={Clock}
            color="cyan"
          />
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem',
          }}
        >
          <button
            onClick={() => setActiveTab('incoming')}
            style={{
              padding: '0.65rem 1.25rem',
              fontWeight: 600,
              fontSize: '0.88rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'incoming' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'incoming' ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: '-1px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Truck size={15} /> Incoming Claims
            {incomingRequests.length > 0 && (
              <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('active')}
            style={{
              padding: '0.65rem 1.25rem',
              fontWeight: 600,
              fontSize: '0.88rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'active' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'active' ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            Active Listings ({activeDonationsList.length})
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
              color: activeTab === 'history' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'history' ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            History ({historyList.length})
          </button>
        </div>

        {/* TAB 1: INCOMING REQUESTS */}
        {activeTab === 'incoming' && (
          <div>
            {incomingRequests.length === 0 ? (
              <div className="card flex-center" style={{ minHeight: '180px', flexDirection: 'column', gap: '0.4rem', textAlign: 'center' }}>
                <CheckCircle2 size={32} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.05rem' }}>All requests up to date</h3>
                <p style={{ fontSize: '0.85rem' }}>When an NGO requests to collect your food, it will appear here for instant approval.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {incomingRequests.map((req) => (
                  <div
                    key={req._id}
                    className="card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1.25rem',
                      padding: '1.25rem 1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '260px', flex: '1 1 300px' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'var(--accent-light)',
                          color: 'var(--accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Building2 size={24} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                            {req.receiverOrg || req.receiverName}
                          </h3>
                          <span className="badge badge-amber">Pending Approval</span>
                        </div>
                        <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                          Food: <strong>{req.listingId?.title || 'Surplus Batch'}</strong>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                          Target: {req.targetBeneficiaryGroup} (~{req.estimatedBeneficiariesCount} people) • Transport: {req.transportMode}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                      <Link to={`/tracking/${req._id}`} className="btn btn-secondary btn-sm">
                        <Eye size={14} /> Details
                      </Link>
                      <button
                        onClick={() => handleAcceptPickup(req._id)}
                        className="btn btn-primary btn-sm"
                      >
                        <CheckCircle2 size={15} /> Accept Claim
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE DONATIONS */}
        {activeTab === 'active' && (
          <div>
            {activeDonationsList.length === 0 ? (
              <div className="card flex-center" style={{ minHeight: '180px', flexDirection: 'column', gap: '0.75rem', textAlign: 'center' }}>
                <Clock size={32} style={{ color: 'var(--text-dim)' }} />
                <h3 style={{ fontSize: '1.05rem' }}>No active food listings</h3>
                <Link to="/create-listing" className="btn btn-primary btn-sm">
                  <PlusCircle size={14} /> Create Food Donation
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activeDonationsList.map((item) => (
                  <div
                    key={item._id}
                    className="card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      padding: '1rem 1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                        alt={item.title}
                        style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.title}</h4>
                          <span className={`badge ${item.status === 'Available' ? 'badge-emerald' : 'badge-amber'}`}>
                            {item.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          QTY: {item.quantity} {item.quantityUnit} (~{item.estimatedMeals} meals) • {item.category}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FreshnessBadge expiryTime={item.expiryTime} urgencyScore={item.urgencyScore} />
                      <Link
                        to={`/listings/${item._id}`}
                        className="btn btn-sm"
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontWeight: 600,
                        }}
                      >
                        <Sparkles size={13} /> AI Matches
                      </Link>
                      <Link to={`/listings/${item._id}`} className="btn btn-secondary btn-sm">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HISTORY */}
        {activeTab === 'history' && (
          <div>
            {historyList.length === 0 ? (
              <div className="card flex-center" style={{ minHeight: '160px' }}>
                <p style={{ fontSize: '0.88rem' }}>No completed donations recorded yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {historyList.map((item) => (
                  <div key={item._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', padding: '1rem 1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.listingId?.title || 'Surplus Food Batch'}</h4>
                        <span className={`badge ${item.status === 'Delivered' ? 'badge-emerald' : 'badge-rose'}`}>
                          {item.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        Distributed by <strong>{item.receiverOrg || item.receiverName}</strong> to {item.targetBeneficiaryGroup}
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
    </div>
  );
};

export default DonorDashboard;
