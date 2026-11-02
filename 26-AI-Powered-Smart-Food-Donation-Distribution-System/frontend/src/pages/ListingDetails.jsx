import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import FreshnessBadge from '../components/listings/FreshnessBadge';
import FoodMap from '../components/map/FoodMap';
import Modal from '../components/common/Modal';
import StarRating from '../components/reviews/StarRating';
import AiMatchSection from '../components/ai/AiMatchSection';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Clock,
  Utensils,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Claim Modal
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimForm, setClaimForm] = useState({
    transportMode: 'Light Commercial Van',
    volunteerCount: 2,
    targetBeneficiaryGroup: 'Urban Slum Community',
    estimatedBeneficiariesCount: 25,
    pickupNotes: '',
  });
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');

  const fetchDetails = async () => {
    try {
      const data = await api.get(`/listings/${id}`);
      if (data.success) {
        setListing(data.listing);
        setClaimForm((prev) => ({
          ...prev,
          estimatedBeneficiariesCount: data.listing.estimatedMeals || data.listing.quantity || 25,
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load listing details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setClaimSubmitting(true);
    try {
      const res = await api.post('/pickups', {
        listingId: listing._id,
        ...claimForm,
      });

      if (res.success) {
        setClaimSuccessMsg('Claim request dispatched to donor! Handover tracking initiated.');
        fetchDetails();
        setTimeout(() => {
          setClaimModalOpen(false);
          navigate(`/tracking/${res.pickup._id}`);
        }, 1500);
      }
    } catch (err) {
      alert(err.message || 'Failed to submit claim');
    } finally {
      setClaimSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '2.5rem' }}>🍲</div>
        <div style={{ color: 'var(--text-slate-500)', fontWeight: 600 }}>Loading food donation details...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container flex-center" style={{ minHeight: '50vh', flexDirection: 'column', textAlign: 'center', padding: '3rem 0' }}>
        <div className="bg-white-card" style={{ padding: '2.5rem', maxWidth: '500px' }}>
          <AlertTriangle size={36} style={{ color: 'var(--rose-600)', margin: '0 auto 1rem auto' }} />
          <h2>Listing Not Found</h2>
          <p style={{ margin: '0.5rem 0 1.5rem 0', color: 'var(--text-slate-600)' }}>{error || 'This listing may have been removed or fulfilled.'}</p>
          <Link to="/listings" className="btn btn-primary">
            Back to Food Listings
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = listing.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/listings"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--text-slate-600)',
            }}
          >
            <ArrowLeft size={16} /> Back to Food Feed
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Left Column: Image, Description, Map */}
          <div>
            {/* Hero Image */}
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '1.5rem',
                maxHeight: '380px',
                border: '1px solid var(--border-slate-200)',
              }}
            >
              <img
                src={imageUrl}
                alt={listing.title}
                style={{ width: '100%', height: '340px', objectFit: 'cover' }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  right: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span className="badge badge-emerald" style={{ background: 'var(--bg-card)', color: 'var(--emerald-600)' }}>
                  {listing.status}
                </span>
                <FreshnessBadge expiryTime={listing.expiryTime} urgencyScore={listing.urgencyScore} />
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Food Details & Preparation Notes
              </h3>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem', color: 'var(--text-slate-700)' }}>
                {listing.description || 'Freshly prepared edible surplus packaged hygienically and stored in optimal conditions.'}
              </p>

              {listing.allergens && listing.allergens.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-slate-500)', marginBottom: '0.35rem' }}>
                    Allergen Declaration
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {listing.allergens.map((alg, i) => (
                      <span key={i} className="badge badge-rose" style={{ fontSize: '0.75rem' }}>
                        {alg}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ background: 'var(--bg-slate-100)', padding: '0.85rem 1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-slate-900)', marginBottom: '0.2rem' }}>
                  Special Pickup Instructions:
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-slate-600)' }}>
                  {listing.specialInstructions || 'Please bring insulated thermal bags or standard food crates.'}
                </div>
              </div>
            </div>

            {/* Smart AI Matchmaker & NGO Recommendations */}
            <AiMatchSection
              listingId={listing._id}
              onClaimClick={() => setClaimModalOpen(true)}
            />

            {/* Location Map */}
            <div className="bg-white-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={18} style={{ color: 'var(--emerald-600)' }} /> Pickup Location
              </h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-slate-600)', marginBottom: '1rem' }}>
                {listing.pickupAddress?.street}, {listing.pickupAddress?.city} - {listing.pickupAddress?.pincode}
              </div>
              <FoodMap listings={[listing]} height="280px" initialCenter={[listing.location?.coordinates?.[1] || 28.6139, listing.location?.coordinates?.[0] || 77.2090]} />
            </div>
          </div>

          {/* Right Column: Title, Specs, Donor Card, Actions */}
          <div>
            <div className="bg-white-card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
              {/* Category & Diet Badges */}
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-indigo">
                  <Utensils size={12} /> {listing.category}
                </span>
                <span className="badge badge-emerald">{listing.dietaryType}</span>
                <span className="badge badge-slate">{listing.storageCondition}</span>
              </div>

              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem' }}>
                {listing.title}
              </h1>

              {/* Core Quantity Highlight */}
              <div
                style={{
                  background: 'var(--emerald-50)',
                  border: '1px solid var(--emerald-200)',
                  borderRadius: '10px',
                  padding: '1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-slate-500)' }}>
                    Donation Quantity
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-slate-900)' }}>
                    {listing.quantity} {listing.quantityUnit}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-slate-500)' }}>
                    Impact Potential
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--emerald-600)', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                    <Users size={17} /> ~{listing.estimatedMeals || listing.quantity} Meals
                  </div>
                </div>
              </div>

              {/* Time Specifications */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                <div className="flex-between">
                  <span style={{ color: 'var(--text-slate-500)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} /> Prepared Time:
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {new Date(listing.cookedTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex-between">
                  <span style={{ color: 'var(--text-slate-500)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} /> Expiry Deadline:
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--amber-600)' }}>
                    {new Date(listing.expiryTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Donor Profile Card */}
              <div
                style={{
                  borderTop: '1px solid var(--border-slate-200)',
                  paddingTop: '1.15rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-slate-500)', marginBottom: '0.6rem' }}>
                  Food Donor Organization
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={listing.donorId?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${listing.donorName}`}
                    alt={listing.donorName}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {listing.donorOrg || listing.donorName}
                      {listing.donorId?.isVerified && (
                        <ShieldCheck size={15} style={{ color: 'var(--emerald-600)' }} title="Verified Donor" />
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-slate-500)' }}>
                      {listing.donorId?.organizationType || 'Food Donor'} • {listing.donorId?.address?.city || 'Metro Central'}
                    </div>
                    <div style={{ marginTop: '0.2rem' }}>
                      <StarRating rating={listing.donorId?.rating || 5} size={13} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                {listing.status === 'Available' ? (
                  role === 'receiver' ? (
                    <button
                      onClick={() => setClaimModalOpen(true)}
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%' }}
                    >
                      <Truck size={18} /> Claim Food & Request Pickup
                    </button>
                  ) : !isAuthenticated ? (
                    <button
                      onClick={() => navigate('/login')}
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%' }}
                    >
                      Sign In as NGO to Claim
                    </button>
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        background: 'var(--bg-slate-100)',
                        fontSize: '0.82rem',
                        color: 'var(--text-slate-600)',
                      }}
                    >
                      💡 Switch to or log in as an <strong>NGO / Receiver</strong> account to claim this surplus batch.
                    </div>
                  )
                ) : listing.activeClaimId ? (
                  <Link
                    to={`/tracking/${typeof listing.activeClaimId === 'object' ? listing.activeClaimId._id : listing.activeClaimId}`}
                    className="btn btn-blue btn-lg"
                    style={{ width: '100%' }}
                  >
                    <Truck size={18} /> View Live Pickup Tracking
                  </Link>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: 'var(--rose-50)',
                      color: 'var(--rose-600)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                    }}
                  >
                    This listing is currently {listing.status}.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      <Modal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        title="Claim Surplus Food Donation"
      >
        <form onSubmit={handleClaimSubmit}>
          {claimSuccessMsg ? (
            <div
              style={{
                background: 'var(--emerald-50)',
                border: '1px solid var(--emerald-200)',
                padding: '1.5rem',
                borderRadius: '8px',
                textAlign: 'center',
                color: 'var(--emerald-600)',
              }}
            >
              <CheckCircle2 size={36} style={{ margin: '0 auto 0.5rem auto' }} />
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Claim Submitted!</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-slate-700)', marginTop: '0.4rem' }}>
                {claimSuccessMsg}
              </p>
            </div>
          ) : (
            <div>
              <div
                style={{
                  background: 'var(--bg-slate-100)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-slate-900)' }}>
                  {listing.title}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-slate-500)', marginTop: '0.2rem' }}>
                  Donor: <strong>{listing.donorOrg || listing.donorName}</strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--emerald-600)', fontWeight: 700, marginTop: '0.2rem' }}>
                  📦 Quantity: {listing.quantity} {listing.quantityUnit} (Feeds ~{listing.estimatedMeals} people)
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Transport Vehicle Mode</label>
                <select
                  className="form-control"
                  value={claimForm.transportMode}
                  onChange={(e) => setClaimForm({ ...claimForm, transportMode: e.target.value })}
                  required
                >
                  <option value="Light Commercial Van">Light Commercial Van</option>
                  <option value="Refrigerated Vehicle">Refrigerated Van (Cold Chain)</option>
                  <option value="Car / Auto">Car / Auto</option>
                  <option value="Two Wheeler / Cargo Bike">Two Wheeler / Cargo Bike</option>
                  <option value="Walk / Hand Cart">Walk / Hand Cart</option>
                </select>
              </div>

              <div className="grid-2" style={{ gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Target Beneficiary Group</label>
                  <select
                    className="form-control"
                    value={claimForm.targetBeneficiaryGroup}
                    onChange={(e) => setClaimForm({ ...claimForm, targetBeneficiaryGroup: e.target.value })}
                    required
                  >
                    <option value="Urban Slum Community">Urban Slum Community</option>
                    <option value="Orphanage / Children Shelter">Orphanage / Children Shelter</option>
                    <option value="Senior Citizens Home">Senior Citizens Home</option>
                    <option value="Homeless Night Shelter">Homeless Night Shelter</option>
                    <option value="Migrant Workers Settlement">Migrant Workers Settlement</option>
                    <option value="Community Kitchen Hub">Community Kitchen Hub</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Est. Beneficiaries (People Fed)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={claimForm.estimatedBeneficiariesCount}
                    onChange={(e) => setClaimForm({ ...claimForm, estimatedBeneficiariesCount: Number(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pickup & Arrival Note to Donor</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="e.g. Volunteer team with thermal containers will arrive in 45 minutes."
                  value={claimForm.pickupNotes}
                  onChange={(e) => setClaimForm({ ...claimForm, pickupNotes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setClaimModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={claimSubmitting}
                >
                  <Truck size={16} /> {claimSubmitting ? 'Submitting...' : 'Confirm & Request Pickup'}
                </button>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default ListingDetails;
