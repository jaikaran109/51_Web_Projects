import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'emerald',
  suffix = '',
  prefix = '',
}) => {
  const colorMap = {
    emerald: { text: '#10b981', bg: 'var(--primary-light)', border: 'var(--primary-border)' },
    amber: { text: '#f59e0b', bg: 'var(--amber-light)', border: 'var(--amber-border)' },
    indigo: { text: '#6366f1', bg: 'var(--accent-light)', border: 'rgba(99, 102, 241, 0.2)' },
    cyan: { text: '#06b6d4', bg: 'var(--cyan-light)', border: 'rgba(6, 182, 212, 0.2)' },
    rose: { text: '#ef4444', bg: 'var(--rose-light)', border: 'var(--rose-border)' },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem',
      }}
    >
      <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {title}
        </div>
        {Icon && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: scheme.bg,
              color: scheme.text,
              border: `1px solid ${scheme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            lineHeight: 1.1,
          }}
        >
          {prefix}
          {typeof value === 'number' ? value.toLocaleString() : value}
          {suffix}
        </div>

        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
