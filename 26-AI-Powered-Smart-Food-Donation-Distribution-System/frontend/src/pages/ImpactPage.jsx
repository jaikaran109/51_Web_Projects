import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatCard from '../components/common/StatCard';
import StarRating from '../components/reviews/StarRating';
import {
  Heart,
  Sparkles,
  Trophy,
  ShieldCheck,
  Building2,
  Truck,
  Users,
  Award,
  Flame,
} from 'lucide-react';

const ImpactPage = () => {
  const [leaderboard, setLeaderboard] = useState({ topDonors: [], topNgos: [] });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        const [lbRes, statsRes] = await Promise.all([
          api.get('/users/leaderboard'),
          api.get('/analytics/overview'),
        ]);

        if (lbRes.success) setLeaderboard(lbRes);
        if (statsRes.success) setStats(statsRes.stats);
      } catch (err) {
        console.warn('Failed to load impact data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImpactData();
  }, []);

  return (
    <div className="section-py">
      <div className="container">
        {/* Impact Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
            <Award size={14} /> Collective Community Impact
          </span>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.15 }}>
            Fighting Hunger & Climate Impact Together
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            Celebrating our top donor partners and relief NGO teams whose dedication turns food surplus into nourishment every day.
          </p>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid-4" style={{ marginBottom: '3.5rem' }}>
          <StatCard
            title="Total Meals Served"
            value={stats?.totalMealsSaved || 12500}
            subtitle="Nourished hungry families"
            icon={Heart}
            color="emerald"
          />
          <StatCard
            title="Surplus Rescued"
            value={stats?.totalFoodKg || 5000}
            suffix=" kg"
            subtitle="Diverted from waste"
            icon={Trophy}
            color="indigo"
          />
          <StatCard
            title="CO2 Offset"
            value={stats?.co2AvoidedKg || 12500}
            suffix=" kg"
            subtitle="Carbon emissions saved"
            icon={Sparkles}
            color="amber"
          />
          <StatCard
            title="Community Value"
            value={stats?.estimatedValueUsd || 34375}
            prefix="$"
            subtitle="Estimated food value"
            icon={ShieldCheck}
            color="cyan"
          />
        </div>

        {/* Leaderboards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
          {/* Top Donors */}
          <div className="card card-glass" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--primary-500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Trophy size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Top Food Donors</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Caterers, Restaurants & Supermarkets</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {leaderboard.topDonors?.map((donor, idx) => (
                <div
                  key={donor._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#d97706' : 'var(--bg-muted)',
                        color: idx < 3 ? '#ffffff' : 'var(--text-main)',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {donor.organizationName || donor.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {donor.organizationType} • {donor.location?.coordinates ? 'Metro Central' : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary-500)', fontSize: '0.95rem' }}>
                      {donor.metrics?.totalDonatedKg || 0} kg
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      ~{donor.metrics?.totalMealsSaved || 0} meals
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top NGO Distributors */}
          <div className="card card-glass" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--accent-500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Truck size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Top NGO Distributors</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Relief Charities & Shelters</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {leaderboard.topNgos?.map((ngo, idx) => (
                <div
                  key={ngo._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#d97706' : 'var(--bg-muted)',
                        color: idx < 3 ? '#ffffff' : 'var(--text-main)',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {ngo.organizationName || ngo.name}
                        {ngo.isVerified && <ShieldCheck size={14} style={{ color: 'var(--primary-500)' }} />}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {ngo.organizationType}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--accent-500)', fontSize: '0.95rem' }}>
                      {ngo.metrics?.totalMealsSaved || 0} Meals
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {ngo.metrics?.totalPickupsCompleted || 0} pickups
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactPage;
