import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Utensils,
  Users,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import FreshnessBadge from './FreshnessBadge';
import { useAuth } from '../../context/AuthContext';

const ListingCard = ({ listing, onClaimClick }) => {
  const { role } = useAuth();
  const navigate = useNavigate();

  const imageUrl =
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

  const statusBadgeColor = {
    Available: 'badge-emerald',
    Requested: 'badge-amber',
    Accepted: 'badge-indigo',
    'Picked Up': 'badge-cyan',
    Delivered: 'badge-emerald',
    Expired: 'badge-rose',
  }[listing.status] || 'badge-emerald';

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: '170px', overflow: 'hidden', background: 'var(--bg-muted)' }}>
        <img
          src={imageUrl}
          alt={listing.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span className={`badge ${statusBadgeColor}`} style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', backdropFilter: 'blur(4px)' }}>
            {listing.status}
          </span>
          <FreshnessBadge
            expiryTime={listing.expiryTime}
            urgencyScore={listing.urgencyScore}
          />
        </div>

        {/* Category Pill */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '10px',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            color: '#ffffff',
            padding: '0.15rem 0.55rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.7rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <Utensils size={11} />
          {listing.category}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Donor Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {listing.donorOrg || listing.donorName}
          </span>
          {listing.donorId?.isVerified && (
            <ShieldCheck size={13} style={{ color: 'var(--primary)' }} />
          )}
        </div>

        {/* Title */}
        <h4
          style={{
            fontSize: '0.98rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          <Link to={`/listings/${listing._id}`}>
            {listing.title}
          </Link>
        </h4>

        {/* Quantity and Meals row */}
        <div
          style={{
            background: 'var(--bg-muted)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem',
            fontSize: '0.8rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>QTY: </span>
            <strong style={{ color: 'var(--text-main)' }}>{listing.quantity} {listing.quantityUnit}</strong>
          </div>
          <div style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Users size={12} /> ~{listing.estimatedMeals || listing.quantity} Meals
          </div>
        </div>

        {/* Location & Diet */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={13} style={{ color: 'var(--text-dim)' }} />
            <span>{listing.pickupAddress?.city || 'Metro Central'}</span>
          </div>

          <span className="badge badge-muted" style={{ fontSize: '0.68rem' }}>
            {listing.dietaryType}
          </span>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.4rem' }}>
          <Link
            to={`/listings/${listing._id}`}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            Details <ChevronRight size={13} />
          </Link>

          {role === 'receiver' && listing.status === 'Available' && (
            <button
              onClick={() => onClaimClick ? onClaimClick(listing) : navigate(`/listings/${listing._id}`)}
              className="btn btn-primary btn-sm"
              style={{ flex: 1.1 }}
            >
              Claim Food
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
