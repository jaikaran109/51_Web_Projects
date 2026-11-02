import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Truck,
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  UtensilsCrossed,
  Globe2,
  Layers,
} from 'lucide-react';
import api from '../services/api';
import ListingCard from '../components/listings/ListingCard';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, role, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalMealsSaved: 12500,
    totalFoodKg: 5000,
    co2AvoidedKg: 12500,
    activeListings: 8,
    totalDonors: 14,
    totalNgos: 9,
  });
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, listingsRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/listings?limit=6&status=Available'),
        ]);

        if (statsRes.success && statsRes.stats) {
          setStats(statsRes.stats);
        }
        if (listingsRes.success && listingsRes.listings) {
          setFeaturedListings(listingsRes.listings);
        }
      } catch (err) {
        console.warn('Failed to load home data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const roles = [
    {
      id: 'donor',
      label: 'Donor Portal',
      icon: Heart,
      desc: 'Donate surplus food from restaurants, caterers & banquets.',
      btnColor: 'btn-rose',
      iconBg: 'var(--rose-50)',
      iconColor: 'var(--rose-600)',
    },
    {
      id: 'receiver',
      label: 'NGO Portal',
      icon: Building2,
      desc: 'Claim food donations for shelters, orphanages & kitchens.',
      btnColor: 'btn-amber',
      iconBg: 'var(--amber-50)',
      iconColor: 'var(--amber-600)',
    },
    {
      id: 'volunteer',
      label: 'Volunteer Dispatch',
      icon: Truck,
      desc: 'Route collection vehicles with live map & OTP verification.',
      btnColor: 'btn-blue',
      iconBg: 'var(--blue-50)',
      iconColor: 'var(--blue-600)',
    },
    {
      id: 'admin',
      label: 'Admin Control',
      icon: ShieldCheck,
      desc: 'Moderate listings, verify NGO docs & monitor platform KPIs.',
      btnColor: 'btn-primary',
      iconBg: 'var(--emerald-50)',
      iconColor: 'var(--emerald-600)',
    },
  ];

  const handleRoleSelect = async (roleId) => {
    if (roleId === 'volunteer') {
      navigate('/listings');
    } else {
      try {
        const res = await demoLogin(roleId);
        if (roleId === 'donor') navigate('/donor-dashboard');
        else if (roleId === 'receiver') navigate('/receiver-dashboard');
        else if (roleId === 'admin') navigate('/admin-dashboard');
        else navigate('/');
      } catch (err) {
        navigate('/login');
      }
    }
  };

  return (
    <div style={{ background: 'var(--bg-slate-50)', minHeight: '100vh' }}>
      {/* 1. HERO HEADER */}
      <section style={{ padding: '3.5rem 0 2.5rem 0', textAlign: 'center', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-slate-200)' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.85rem',
              borderRadius: '9999px',
              background: 'var(--emerald-50)',
              border: '1px solid var(--emerald-200)',
              color: 'var(--emerald-600)',
              fontWeight: 700,
              fontSize: '0.78rem',
              marginBottom: '1rem',
            }}
          >
            🌱 Community Food Waste Redistribution Network
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-slate-900)', lineHeight: 1.2, marginBottom: '0.85rem' }}>
            Food Donation & Redistribution Platform
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--text-slate-600)', maxWidth: '640px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Connecting commercial kitchens and surplus donors with verified relief NGOs. Eliminate food waste and feed vulnerable communities with real-time tracking.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/listings" className="btn btn-primary btn-lg">
              <Layers size={17} /> Explore Surplus Food
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Register Organization <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SELECT YOUR WORKSPACE / ROLE CARDS */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>
              Quick 1-Click Access
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Choose Your Role Workspace</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-500)', marginTop: '0.2rem' }}>
              Click any role below to enter the dedicated dashboard instantly.
            </p>
          </div>

          <div className="grid-4">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.id}
                  className="bg-white-card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderTop: `4px solid ${r.iconColor}`,
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: r.iconBg,
                        color: r.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      {r.label}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-slate-600)', lineHeight: 1.5 }}>
                      {r.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRoleSelect(r.id)}
                    className={`btn ${r.btnColor} btn-sm`}
                    style={{ marginTop: '1.25rem', width: '100%' }}
                  >
                    Enter Workspace <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. IMPACT METRICS */}
      <section style={{ padding: '2.5rem 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border-slate-200)', borderBottom: '1px solid var(--border-slate-200)' }}>
        <div className="container">
          <div className="grid-4">
            <StatCard
              title="Meals Saved & Served"
              value={stats.totalMealsSaved || 12500}
              subtitle="Distributed to people in need"
              icon={Heart}
              color="emerald"
            />
            <StatCard
              title="Surplus Food Rescued"
              value={stats.totalFoodKg || 5000}
              suffix=" kg"
              subtitle="Diverted from city landfills"
              icon={UtensilsCrossed}
              color="indigo"
            />
            <StatCard
              title="CO2 Offset"
              value={stats.co2AvoidedKg || 12500}
              suffix=" kg"
              subtitle="Greenhouse emissions avoided"
              icon={Sparkles}
              color="amber"
            />
            <StatCard
              title="Verified NGOs"
              value={stats.totalNgos || 9}
              subtitle="Active distribution partners"
              icon={Building2}
              color="cyan"
            />
          </div>
        </div>
      </section>

      {/* 4. UN SUSTAINABLE DEVELOPMENT GOALS */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="badge badge-indigo" style={{ marginBottom: '0.4rem' }}>
              <Globe2 size={12} /> Global Sustainability
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Aligned with UN Sustainable Development Goals</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-500)', marginTop: '0.2rem' }}>
              Advancing international benchmarks for zero hunger, responsible consumption, and sustainable cities.
            </p>
          </div>

          <div className="grid-3">
            <div className="bg-white-card" style={{ padding: '1.5rem', borderTop: '4px solid #ef4444' }}>
              <div className="flex-between" style={{ marginBottom: '0.6rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ef4444' }}>SDG 2</span>
                <span className="badge badge-rose">Primary Target</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Zero Hunger</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-slate-600)', lineHeight: 1.55 }}>
                Directly connects edible surplus food from events and restaurants to shelters, orphanages, and destitute groups.
              </p>
            </div>

            <div className="bg-white-card" style={{ padding: '1.5rem', borderTop: '4px solid #f59e0b' }}>
              <div className="flex-between" style={{ marginBottom: '0.6rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f59e0b' }}>SDG 12</span>
                <span className="badge badge-amber">Core Objective</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Responsible Consumption</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-slate-600)', lineHeight: 1.55 }}>
                Reduces food waste across the production and consumption lifecycle through structured logistics matching.
              </p>
            </div>

            <div className="bg-white-card" style={{ padding: '1.5rem', borderTop: '4px solid #10b981' }}>
              <div className="flex-between" style={{ marginBottom: '0.6rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#10b981' }}>SDG 11</span>
                <span className="badge badge-emerald">Climate Action</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Sustainable Communities</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-slate-600)', lineHeight: 1.55 }}>
                Diverts organic food matter from landfill decomposition, mitigating municipal greenhouse emissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE SURPLUS FOOD FEED */}
      <section style={{ padding: '3rem 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border-slate-200)' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '1.75rem', flexWrap: 'wrap' }}>
            <div>
              <span className="badge badge-amber" style={{ marginBottom: '0.3rem' }}>
                Live Surplus Batches
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Available Food Donations Nearby</h2>
            </div>

            <Link to="/listings" className="btn btn-secondary btn-sm">
              View All Food <ArrowRight size={14} />
            </Link>
          </div>

          {featuredListings.length === 0 ? (
            <div className="bg-white-card flex-center" style={{ minHeight: '180px', flexDirection: 'column', gap: '0.5rem' }}>
              <UtensilsCrossed size={28} style={{ color: 'var(--text-slate-400)' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-slate-500)' }}>No active surplus batches right now.</p>
            </div>
          ) : (
            <div className="grid-3">
              {featuredListings.map((item) => (
                <ListingCard key={item._id} listing={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
