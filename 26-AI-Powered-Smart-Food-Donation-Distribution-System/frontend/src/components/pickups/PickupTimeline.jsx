import React from 'react';
import { Clock, CheckCircle2, Truck, Gift, AlertCircle, XCircle } from 'lucide-react';

const STEPS = [
  { key: 'Pending', label: 'Claim Requested', icon: Clock, desc: 'NGO requested surplus food' },
  { key: 'Accepted', label: 'Accepted by Donor', icon: CheckCircle2, desc: 'Pickup time & handover approved' },
  { key: 'Picked Up', label: 'Collected in Transit', icon: Truck, desc: 'Loaded into vehicle' },
  { key: 'Delivered', label: 'Distributed & Verified', icon: Gift, desc: 'Served to community beneficiaries' },
];

const PickupTimeline = ({ currentStatus = 'Pending', statusTimeline = [], verificationOtp, isOtpVerified }) => {
  const getStepIndex = (status) => {
    if (status === 'Cancelled' || status === 'Rejected') return -1;
    return STEPS.findIndex((s) => s.key === status);
  };

  const currentIndex = getStepIndex(currentStatus);
  const isCancelled = currentStatus === 'Cancelled' || currentStatus === 'Rejected';

  return (
    <div className="card-glass" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
            Logistics & Donation Lifecycle
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.2rem' }}>
            Current Status:{' '}
            <span
              style={{
                color: isCancelled
                  ? 'var(--rose-500)'
                  : currentStatus === 'Delivered'
                  ? 'var(--primary-500)'
                  : 'var(--accent-500)',
              }}
            >
              {currentStatus}
            </span>
          </h3>
        </div>

        {verificationOtp && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px dashed rgba(16, 185, 129, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '0.6rem 1.2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Handover Verification OTP
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1.4rem',
                fontWeight: 900,
                color: 'var(--primary-500)',
                letterSpacing: '0.15em',
              }}
            >
              {verificationOtp}
            </div>
            {isOtpVerified && (
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>
                ✓ OTP Verified
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stepper Visual Track */}
      {!isCancelled ? (
        <div className="timeline-stepper">
          <div className="timeline-line">
            <div
              className="timeline-line-progress"
              style={{
                width: `${(Math.max(0, currentIndex) / (STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentIndex > idx;
            const isActive = currentIndex === idx;

            return (
              <div
                key={step.key}
                className={`timeline-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <div className="timeline-node">
                  <Icon size={20} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="timeline-label">{step.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', maxWidth: '140px', marginTop: '0.15rem' }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <XCircle size={28} style={{ color: 'var(--rose-500)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--rose-500)' }}>This Pickup Claim Was Cancelled</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              The food listing was automatically returned to the active available pool for other NGOs.
            </div>
          </div>
        </div>
      )}

      {/* Detailed Status Event Logs */}
      {statusTimeline.length > 0 && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Donation Audit Log Trail
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {statusTimeline.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  fontSize: '0.85rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-main)',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--primary-500)',
                    marginTop: '6px',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.status}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.note}</div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PickupTimeline;
