import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Users,
  Building2,
  UtensilsCrossed,
  Truck,
  Heart,
  BarChart3,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'listings', 'logs'

  // User search & filter
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [overviewRes, usersRes, listingsRes, logsRes] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/users?limit=50'),
        api.get('/listings?status=all&limit=50'),
        api.get('/analytics/activity-logs?limit=40'),
      ]);

      if (overviewRes.success) setStats(overviewRes.stats);
      if (usersRes.success) setUsers(usersRes.users || []);
      if (listingsRes.success) setListings(listingsRes.listings || []);
      if (logsRes.success) setActivityLogs(logsRes.logs || []);
    } catch (err) {
      console.warn('Admin data load failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerifyNgo = async (userId, newStatus) => {
    try {
      const res = await api.put(`/users/${userId}/verify-ngo`, { verificationStatus: newStatus });
      if (res.success) {
        alert(`NGO status updated to: ${newStatus}`);
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to verify NGO');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const res = await api.put(`/users/${userId}/status`, { isActive: !currentStatus });
      if (res.success) {
        alert(`User status changed to ${!currentStatus ? 'Active' : 'Deactivated'}`);
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to remove this food listing from the platform?')) return;
    try {
      const res = await api.delete(`/listings/${listingId}`);
      if (res.success) {
        alert('Listing removed successfully.');
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete listing');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.organizationName && u.organizationName.toLowerCase().includes(userSearch.toLowerCase()));
    const matchesRole = userRoleFilter ? u.role === userRoleFilter : true;
    return matchesSearch && matchesRole;
  });

  const getActionMeta = (action) => {
    switch (action) {
      case 'NGO_VERIFIED':
        return { label: 'NGO Verified', badgeClass: 'badge-emerald', Icon: ShieldCheck };
      case 'PICKUP_REQUESTED':
        return { label: 'Pickup Requested', badgeClass: 'badge-amber', Icon: Truck };
      case 'LISTING_CREATED':
        return { label: 'Listing Created', badgeClass: 'badge-emerald', Icon: UtensilsCrossed };
      case 'USER_LOGIN':
        return { label: 'User Login', badgeClass: 'badge-blue', Icon: Users };
      case 'USER_REGISTERED':
        return { label: 'User Registered', badgeClass: 'badge-indigo', Icon: Building2 };
      case 'LISTING_DELETED':
        return { label: 'Listing Removed', badgeClass: 'badge-rose', Icon: Trash2 };
      case 'AI_NGO_NOTIFIED':
        return { label: 'AI Match Alert', badgeClass: 'badge-indigo', Icon: Sparkles };
      default:
        return { label: action?.replace(/_/g, ' ') || 'Activity', badgeClass: 'badge-slate', Icon: Activity };
    }
  };

  const getStatusMeta = (status) => {
    switch (status) {
      case 'Available':
        return { badgeClass: 'badge-emerald', Icon: CheckCircle2 };
      case 'Requested':
        return { badgeClass: 'badge-amber', Icon: Clock };
      case 'Accepted':
        return { badgeClass: 'badge-indigo', Icon: Truck };
      case 'Picked Up':
        return { badgeClass: 'badge-blue', Icon: Truck };
      case 'Delivered':
        return { badgeClass: 'badge-emerald', Icon: Heart };
      case 'Expired':
      case 'Cancelled':
        return { badgeClass: 'badge-rose', Icon: XCircle };
      default:
        return { badgeClass: 'badge-slate', Icon: Activity };
    }
  };

  const totalListingCount = listings.length || 1;

  return (
    <div className="section-py">
      <div className="container">
        {/* Admin Header */}
        <div
          className="card"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            borderLeft: '5px solid var(--rose-500)',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(244, 63, 94, 0.04) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'rgba(244, 63, 94, 0.15)',
                color: 'var(--rose-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(244, 63, 94, 0.2)',
              }}
            >
              <ShieldCheck size={32} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Admin Control Tower
                </h1>
                <span className="badge badge-rose" style={{ fontSize: '0.72rem' }}>
                  Platform Governance
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.25rem', marginBottom: 0 }}>
                Real-time monitoring, NGO accreditation verification, listings moderation, and system audit trail.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={loadData}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
            >
              <Activity size={15} /> Refresh Analytics
            </button>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          <StatCard
            title="Total Registered Donors"
            value={stats?.totalDonors || 0}
            subtitle="Commercial & Individual Kitchens"
            icon={Building2}
            color="emerald"
          />
          <StatCard
            title="Verified NGOs"
            value={stats?.verifiedNgos || 0}
            subtitle="Accredited food relief hubs"
            icon={ShieldCheck}
            color="cyan"
          />
          <StatCard
            title="Total Food Rescued"
            value={stats?.totalFoodKg || 5000}
            suffix=" kg"
            subtitle="Community nutrition delivered"
            icon={Heart}
            color="indigo"
          />
          <StatCard
            title="Completed Pickups"
            value={stats?.completedPickups || 0}
            subtitle="Verified food distribution cycles"
            icon={Truck}
            color="amber"
          />
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '2px solid var(--border-color)',
            marginBottom: '1.75rem',
            overflowX: 'auto',
          }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '0.75rem 1.4rem',
              fontWeight: 700,
              fontSize: '0.92rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'overview' ? 'var(--rose-500)' : 'var(--text-muted)',
              borderBottom: activeTab === 'overview' ? '3px solid var(--rose-500)' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <BarChart3 size={17} /> Category Analytics
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '0.75rem 1.4rem',
              fontWeight: 700,
              fontSize: '0.92rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'users' ? 'var(--rose-500)' : 'var(--text-muted)',
              borderBottom: activeTab === 'users' ? '3px solid var(--rose-500)' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <Users size={17} /> User Management ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            style={{
              padding: '0.75rem 1.4rem',
              fontWeight: 700,
              fontSize: '0.92rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'listings' ? 'var(--rose-500)' : 'var(--text-muted)',
              borderBottom: activeTab === 'listings' ? '3px solid var(--rose-500)' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <Layers size={17} /> Listing Moderation ({listings.length})
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            style={{
              padding: '0.75rem 1.4rem',
              fontWeight: 700,
              fontSize: '0.92rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'logs' ? 'var(--rose-500)' : 'var(--text-muted)',
              borderBottom: activeTab === 'logs' ? '3px solid var(--rose-500)' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <Activity size={17} /> Audit Logs ({activityLogs.length})
          </button>
        </div>

        {/* TAB 1: CATEGORY ANALYTICS & STATUS DISTRIBUTION */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {/* Left Card: Category Breakdown */}
            <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <UtensilsCrossed size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      Food Volume by Category
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Surplus inventory distribution
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
                  stats.categoryBreakdown.map((cat, i) => {
                    const percentage = Math.min(100, Math.round((cat.count / totalListingCount) * 100));
                    return (
                      <div
                        key={i}
                        style={{
                          background: 'var(--bg-muted)',
                          padding: '0.9rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                            {cat._id || 'General Surplus'}
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            <strong style={{ color: 'var(--text-main)' }}>{cat.count} listings</strong> ({cat.totalQty} units)
                          </span>
                        </div>

                        {/* Progress bar container */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div
                            style={{
                              flex: 1,
                              height: '8px',
                              background: 'var(--border-color)',
                              borderRadius: '6px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${Math.max(8, percentage)}%`,
                                background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                                borderRadius: '6px',
                                transition: 'width 0.4s ease',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', minWidth: '32px', textAlign: 'right' }}>
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No food category breakdown data available yet.
                  </div>
                )}
              </div>
            </div>

            {/* Right Card: Lifecycle Status Distribution */}
            <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#6366f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      Donation Lifecycle Status
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Active distribution pipeline
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {stats?.statusBreakdown && stats.statusBreakdown.length > 0 ? (
                  stats.statusBreakdown.map((st, i) => {
                    const meta = getStatusMeta(st._id);
                    const StatusIcon = meta.Icon;
                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.85rem 1rem',
                          background: 'var(--bg-muted)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <StatusIcon size={16} style={{ color: 'var(--text-muted)' }} />
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                            {st._id}
                          </span>
                        </div>

                        <span className={`badge ${meta.badgeClass}`} style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem' }}>
                          {st.count} {st.count === 1 ? 'listing' : 'listings'}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No status distribution data recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ position: 'relative', flex: '1 1 280px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Search user name, email, org..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              <select
                className="form-control"
                style={{ width: '180px' }}
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
              >
                <option value="">All User Roles</option>
                <option value="donor">Food Donors</option>
                <option value="receiver">NGOs / Receivers</option>
                <option value="admin">Administrators</option>
              </select>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>User / Organization</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Role</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Accreditation</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Account Status</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700 }}>Moderation</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr
                      key={u._id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{u.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {u.organizationName || u.email}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge badge-${u.role === 'admin' ? 'rose' : u.role === 'donor' ? 'emerald' : 'indigo'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {u.role === 'receiver' ? (
                          u.isVerified ? (
                            <span className="badge badge-emerald">✓ Verified NGO</span>
                          ) : (
                            <button
                              onClick={() => handleVerifyNgo(u._id, 'verified')}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                            >
                              Approve NGO
                            </button>
                          )
                        ) : (
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Standard</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge ${u.isActive ? 'badge-emerald' : 'badge-rose'}`}>
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleToggleUserStatus(u._id, u.isActive)}
                          className={`btn ${u.isActive ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LISTING MODERATION */}
        {activeTab === 'listings' && (
          <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Platform Food Listings
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Active and historical donation batches
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Listing Title</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Donor Hub</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Quantity</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l) => (
                    <tr
                      key={l._id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{l.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {l.category} • {l.dietaryType}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-main)' }}>{l.donorOrg || l.donorName}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{l.quantity} {l.quantityUnit}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge ${getStatusMeta(l.status).badgeClass}`}>
                          {l.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteListing(l._id)}
                          className="btn btn-sm"
                          style={{
                            background: 'rgba(244, 63, 94, 0.15)',
                            color: 'var(--rose-500)',
                            border: '1px solid rgba(244, 63, 94, 0.3)',
                            padding: '0.3rem 0.75rem',
                            fontSize: '0.78rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT ACTIVITY LOGS */}
        {activeTab === 'logs' && (
          <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: 'rgba(244, 63, 94, 0.15)',
                    color: 'var(--rose-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Activity size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    Chronological Audit Trail
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Tamper-evident platform activity record ({activityLogs.length} events)
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activityLogs && activityLogs.length > 0 ? (
                activityLogs.map((log) => {
                  const meta = getActionMeta(log.action);
                  const ActionIcon = meta.Icon;
                  return (
                    <div
                      key={log._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.9rem 1.15rem',
                        background: 'var(--bg-muted)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.86rem',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {/* Left: Action Badge + Description */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 300px' }}>
                        <span
                          className={`badge ${meta.badgeClass}`}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.25rem 0.65rem',
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <ActionIcon size={12} />
                          {meta.label}
                        </span>

                        <span style={{ color: 'var(--text-main)', lineHeight: 1.4, fontWeight: 500 }}>
                          {log.description}
                        </span>
                      </div>

                      {/* Right: Timestamp */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: 'var(--text-muted)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          background: 'var(--bg-card)',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <Clock size={12} />
                        <span>
                          {new Date(log.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No system activity logs recorded yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
