import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ListingCard from '../components/listings/ListingCard';
import ListingFilters from '../components/listings/ListingFilters';
import FoodMap from '../components/map/FoodMap';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { Truck, CheckCircle2, UtensilsCrossed } from 'lucide-react';

const Listings = () => {
  const { user, role } = useAuth();
  const [searchParams] = useSearchParams();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedDiet, setSelectedDiet] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('Available');
  const [sortBy, setSortBy] = useState('urgency');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  // Quick Claim Modal for NGO
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedListingToClaim, setSelectedListingToClaim] = useState(null);
  const [claimForm, setClaimForm] = useState({
    transportMode: 'Light Commercial Van',
    volunteerCount: 2,
    targetBeneficiaryGroup: 'Urban Slum Community',
    estimatedBeneficiariesCount: 30,
    pickupNotes: '',
  });
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedDiet && selectedDiet !== 'all') params.append('dietary', selectedDiet);
      if (selectedStatus && selectedStatus !== 'all') params.append('status', selectedStatus);
      if (sortBy) params.append('sortBy', sortBy);

      const data = await api.get(`/listings?${params.toString()}`);
      if (data.success) {
        setListings(data.listings || []);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.warn('Failed to load listings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [search, selectedCategory, selectedDiet, selectedStatus, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedDiet('all');
    setSelectedStatus('Available');
    setSortBy('urgency');
  };

  const handleOpenClaimModal = (listing) => {
    setSelectedListingToClaim(listing);
    setClaimForm((prev) => ({
      ...prev,
      estimatedBeneficiariesCount: listing.estimatedMeals || listing.quantity || 25,
    }));
    setClaimSuccessMsg('');
    setClaimModalOpen(true);
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!selectedListingToClaim) return;
    setClaimSubmitting(true);
    try {
      const res = await api.post('/pickups', {
        listingId: selectedListingToClaim._id,
        ...claimForm,
      });

      if (res.success) {
        setClaimSuccessMsg('Surplus food claimed successfully! The donor has been notified to accept pickup.');
        fetchListings();
        setTimeout(() => {
          setClaimModalOpen(false);
        }, 1800);
      }
    } catch (err) {
      alert(err.message || 'Failed to claim food');
    } finally {
      setClaimSubmitting(false);
    }
  };

  return (
    <div className="section-py">
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>
            Live Surplus Feed
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Explore Available Food</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Real-time surplus food listings ready for pickup by registered relief teams.
          </p>
        </div>

        {/* Filters */}
        <ListingFilters
          search={search}
          setSearch={setSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedDiet={selectedDiet}
          setSelectedDiet={setSelectedDiet}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          resetFilters={resetFilters}
        />

        {/* Count */}
        <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Showing <strong>{listings.length}</strong> of <strong>{totalCount}</strong> listings
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex-center" style={{ minHeight: '260px', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '2rem' }}>🍲</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Loading food listings...</div>
          </div>
        ) : viewMode === 'map' ? (
          <FoodMap listings={listings} height="520px" />
        ) : listings.length === 0 ? (
          <div
            className="card flex-center"
            style={{
              minHeight: '260px',
              flexDirection: 'column',
              gap: '0.75rem',
              textAlign: 'center',
              padding: '2.5rem',
            }}
          >
            <UtensilsCrossed size={36} style={{ color: 'var(--text-dim)' }} />
            <h3 style={{ fontSize: '1.15rem' }}>No listings found</h3>
            <p style={{ fontSize: '0.88rem', maxWidth: '380px' }}>
              Try adjusting your search keyword or clearing the filters.
            </p>
            <button onClick={resetFilters} className="btn btn-primary btn-sm">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {listings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                onClaimClick={handleOpenClaimModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Claim Modal for NGOs */}
      <Modal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        title="Claim Surplus Food Donation"
      >
        {selectedListingToClaim && (
          <form onSubmit={handleClaimSubmit}>
            {claimSuccessMsg ? (
              <div
                style={{
                  background: 'var(--primary-light)',
                  border: '1px solid var(--primary-border)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  color: 'var(--primary)',
                }}
              >
                <CheckCircle2 size={32} style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Claim Submitted!</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '0.3rem' }}>
                  {claimSuccessMsg}
                </p>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    background: 'var(--bg-muted)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {selectedListingToClaim.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Donor: <strong>{selectedListingToClaim.donorOrg || selectedListingToClaim.donorName}</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, marginTop: '0.2rem' }}>
                    QTY: {selectedListingToClaim.quantity} {selectedListingToClaim.quantityUnit} (Feeds ~{selectedListingToClaim.estimatedMeals} people)
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

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
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
                    <Truck size={15} /> {claimSubmitting ? 'Submitting...' : 'Confirm Claim'}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Listings;
