import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  PlusCircle,
  BarChart3,
  Sparkles,
  User,
  LogOut,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  Truck,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '1.1rem',
            }}
          >
            🍲
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', lineHeight: 1.1 }}>
              Smart<span style={{ color: 'var(--primary)' }}>Food</span>
            </div>
            <div style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Zero Waste Network
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }} className="desktop-nav">
          <Link
            to="/listings"
            style={{
              fontWeight: 600,
              fontSize: '0.88rem',
              color: isActive('/listings') ? 'var(--primary)' : 'var(--text-secondary)',
              background: isActive('/listings') ? 'var(--primary-light)' : 'transparent',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            <Layers size={16} /> Explore Food
          </Link>


          <Link
            to="/impact"
            style={{
              fontWeight: 600,
              fontSize: '0.88rem',
              color: isActive('/impact') ? 'var(--accent)' : 'var(--text-secondary)',
              background: isActive('/impact') ? 'var(--accent-light)' : 'transparent',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            <BarChart3 size={16} /> Impact
          </Link>

          {/* Quick Action Button for authenticated user */}
          {role === 'donor' && (
            <Link
              to="/create-listing"
              className="btn btn-primary btn-sm"
              style={{ marginLeft: '0.5rem' }}
            >
              <PlusCircle size={15} /> Donate Food
            </Link>
          )}

          {role === 'receiver' && (
            <Link
              to="/receiver-dashboard"
              className="btn btn-accent btn-sm"
              style={{ marginLeft: '0.5rem' }}
            >
              <Truck size={15} /> NGO Claims
            </Link>
          )}
        </nav>

        {/* Right Actions: Theme Toggle, Notifications, User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
            title={isDark ? 'Switch to Light' : 'Switch to Dark'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notification Tray */}
          {isAuthenticated && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      background: 'var(--rose)',
                      color: '#ffffff',
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div
                  className="card"
                  style={{
                    position: 'absolute',
                    top: '44px',
                    right: '0',
                    width: '300px',
                    maxHeight: '360px',
                    overflowY: 'auto',
                    padding: '0.85rem',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 1000,
                  }}
                >
                  <div className="flex-between" style={{ marginBottom: '0.5rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Notifications</div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1.25rem 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => {
                          markAsRead(n._id);
                          if (n.link) navigate(n.link);
                          setNotifDropdownOpen(false);
                        }}
                        style={{
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          marginBottom: '0.3rem',
                          background: n.isRead ? 'transparent' : 'var(--primary-light)',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                      >
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{n.title}</div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Auth */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.3rem 0.65rem 0.3rem 0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                }}
              >
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`}
                  alt={user?.name}
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontWeight: 600, fontSize: '0.82rem' }} className="user-name-text">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={13} style={{ color: 'var(--text-dim)' }} />
              </button>

              {userDropdownOpen && (
                <div
                  className="card"
                  style={{
                    position: 'absolute',
                    top: '44px',
                    right: 0,
                    width: '220px',
                    padding: '0.6rem',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 1000,
                  }}
                >
                  <div style={{ padding: '0.4rem 0.4rem 0.6rem 0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user?.organizationName || user?.email}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.4rem' }}>
                    {role === 'donor' && (
                      <Link
                        to="/donor-dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Heart size={14} style={{ color: 'var(--primary)' }} /> Donor Dashboard
                      </Link>
                    )}

                    {role === 'receiver' && (
                      <Link
                        to="/receiver-dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Truck size={14} style={{ color: 'var(--accent)' }} /> NGO Dashboard
                      </Link>
                    )}

                    {role === 'admin' && (
                      <Link
                        to="/admin-dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{ padding: '0.45rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <ShieldCheck size={14} style={{ color: 'var(--rose)' }} /> Admin Control
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{ padding: '0.45rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <User size={14} /> Profile & Settings
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/');
                      }}
                      style={{
                        padding: '0.45rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--rose)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Join
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.2rem',
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          <Link to="/listings" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <Layers size={16} style={{ color: 'var(--primary)' }} /> Explore Food Listings
          </Link>
          <Link to="/impact" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <BarChart3 size={16} style={{ color: 'var(--accent)' }} /> Community Impact
          </Link>

          {isAuthenticated ? (
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {role === 'donor' && (
                <Link to="/donor-dashboard" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                  <Heart size={16} /> Donor Dashboard
                </Link>
              )}
              {role === 'receiver' && (
                <Link to="/receiver-dashboard" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)' }}>
                  <Truck size={16} /> NGO Dashboard
                </Link>
              )}
              {role === 'admin' && (
                <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rose)' }}>
                  <ShieldCheck size={16} /> Admin Control Tower
                </Link>
              )}
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <User size={16} /> Profile & Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--rose)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: 0,
                  marginTop: '0.25rem',
                }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          ) : (
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .user-name-text { display: inline !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
