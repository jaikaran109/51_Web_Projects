import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, Flame } from 'lucide-react';

const FreshnessBadge = ({ expiryTime, urgencyScore = 50 }) => {
  const now = new Date();
  const expiry = new Date(expiryTime);
  const msDiff = expiry.getTime() - now.getTime();
  const hoursLeft = Math.max(0, msDiff / (1000 * 60 * 60));

  let label = '';
  let badgeClass = 'badge-emerald';
  let Icon = CheckCircle2;

  if (hoursLeft <= 0) {
    label = 'Expired';
    badgeClass = 'badge-rose';
    Icon = AlertTriangle;
  } else if (hoursLeft < 2.5 || urgencyScore >= 85) {
    label = `Urgent (${hoursLeft.toFixed(1)}h left)`;
    badgeClass = 'badge-amber';
    Icon = Flame;
  } else if (hoursLeft < 6) {
    label = `Fresh (${Math.round(hoursLeft)}h left)`;
    badgeClass = 'badge-emerald';
    Icon = Clock;
  } else if (hoursLeft < 24) {
    label = `Safe (~${Math.round(hoursLeft)}h left)`;
    badgeClass = 'badge-indigo';
    Icon = Clock;
  } else {
    const days = Math.round(hoursLeft / 24);
    label = `Stable (${days}d left)`;
    badgeClass = 'badge-cyan';
    Icon = CheckCircle2;
  }

  return (
    <span className={`badge ${badgeClass}`} style={{ gap: '0.3rem' }}>
      <Icon size={12} />
      {label}
    </span>
  );
};

export default FreshnessBadge;
