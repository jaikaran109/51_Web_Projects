import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Mail, Phone, MapPin, Sparkles, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '4rem',
        paddingBottom: '2.5rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Col 1: Platform Overview */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                🍲
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem' }}>
                Smart<span style={{ color: 'var(--primary-500)' }}>Food</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              A technology-driven MERN platform bridging the gap between food donors and verified NGOs. Powered by AI demand forecasting and real-time tracking to ensure zero edible food goes to landfill.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-emerald">
                <ShieldCheck size={12} /> UN SDG 2: Zero Hunger
              </span>
              <span className="badge badge-indigo">
                <Sparkles size={12} /> AI Optimized
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>Explore Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/listings" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}>
                  Browse Surplus Food Listings
                </Link>
              </li>
              <li>
                <Link to="/smart-ai" style={{ color: 'var(--text-muted)' }}>
                  AI Demand & Spoilage Predictor
                </Link>
              </li>
              <li>
                <Link to="/impact" style={{ color: 'var(--text-muted)' }}>
                  Community Impact & Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: 'var(--text-muted)' }}>
                  Register as NGO / Receiver
                </Link>
              </li>
              <li>
                <Link to="/create-listing" style={{ color: 'var(--text-muted)' }}>
                  Post Commercial Surplus Food
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Safe Logistics & Guidelines */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>Food Safety & Trust</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li style={{ color: 'var(--text-muted)' }}>✨ 2-Hour Cooked Meal Safety Protocol</li>
              <li style={{ color: 'var(--text-muted)' }}>🔒 6-Digit Handover OTP Verification</li>
              <li style={{ color: 'var(--text-muted)' }}>🛡️ Government Registered NGO Badges</li>
              <li style={{ color: 'var(--text-muted)' }}>📊 Automated Carbon Offset Auditing</li>
              <li style={{ color: 'var(--text-muted)' }}>🌡️ Cold Chain Storage Recommendations</li>
            </ul>
          </div>

          {/* Col 4: Contact & Help */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>Platform Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} style={{ color: 'var(--primary-500)' }} />
                <span>support@smartfooddonation.org</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} style={{ color: 'var(--primary-500)' }} />
                <span>+1 (800) 555-FOOD (3663)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: 'var(--primary-500)' }} />
                <span>100 Governance Blvd, Metro Central</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-dim)',
          }}
        >
          <div>
            © {new Date().getFullYear()} Smart Food Donation Platform. Built on MERN Stack for Capstone Demonstration.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Made with <Heart size={13} style={{ color: 'var(--rose-500)', display: 'inline' }} /> for Community Impact</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
