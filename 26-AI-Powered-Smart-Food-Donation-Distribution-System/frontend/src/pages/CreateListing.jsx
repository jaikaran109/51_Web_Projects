import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  UtensilsCrossed,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const CATEGORIES = [
  'Cooked Meals',
  'Bakery & Bread',
  'Raw Groceries',
  'Fruits & Vegetables',
  'Packaged & Canned',
  'Dairy & Eggs',
  'Beverages',
  'Mixed Assortment',
];

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
];

const CreateListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Cooked Meals',
    dietaryType: 'Vegetarian',
    quantity: 30,
    quantityUnit: 'servings',
    cookedTime: new Date().toISOString().slice(0, 16),
    expiryTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString().slice(0, 16),
    storageCondition: 'Insulated Hot Container',
    allergens: ['Dairy'],
    description: '',
    selectedImage: PRESET_IMAGES[0],
    customImageUrl: '',
    street: user?.address?.street || '45 Royale Plaza, 5th Avenue',
    city: user?.address?.city || 'Metro Central',
    state: user?.address?.state || 'Metro',
    pincode: user?.address?.pincode || '100002',
    contactPhone: user?.phone || '+1 555-0144',
    specialInstructions: 'Enter via rear kitchen service ramp. Contact security for container pass.',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        dietaryType: formData.dietaryType,
        quantity: Number(formData.quantity),
        quantityUnit: formData.quantityUnit,
        cookedTime: new Date(formData.cookedTime),
        expiryTime: new Date(formData.expiryTime),
        storageCondition: formData.storageCondition,
        allergens: formData.allergens,
        description: formData.description,
        images: [formData.customImageUrl || formData.selectedImage],
        pickupAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          formattedAddress: `${formData.street}, ${formData.city}`,
        },
        contactPhone: formData.contactPhone,
        specialInstructions: formData.specialInstructions,
      };

      const res = await api.post('/listings', payload);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/listings/${res.listing._id}`);
        }, 1500);
      }
    } catch (err) {
      alert(err.message || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAllergenToggle = (allergen) => {
    setFormData((prev) => {
      const exists = prev.allergens.includes(allergen);
      return {
        ...prev,
        allergens: exists
          ? prev.allergens.filter((a) => a !== allergen)
          : [...prev.allergens, allergen],
      };
    });
  };

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>
            Donor Portal
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Donate Surplus Food</h1>
          <p style={{ color: 'var(--text-slate-600)', fontSize: '0.92rem' }}>
            List freshly prepared buffets, bakery items, or groceries to instantly connect with verified NGO rescue teams.
          </p>
        </div>

        {success ? (
          <div
            className="bg-white-card flex-center"
            style={{
              padding: '3.5rem',
              flexDirection: 'column',
              textAlign: 'center',
            }}
          >
            <CheckCircle2 size={54} style={{ color: 'var(--emerald-600)', marginBottom: '1rem' }} />
            <h2>Donation Listing Published!</h2>
            <p style={{ marginTop: '0.5rem', maxWidth: '480px', color: 'var(--text-slate-600)' }}>
              Your surplus food listing is now live in the network feed. Nearby NGOs have been alerted for pickup claim.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {/* Left Column: Food Details */}
              <div>
                <div className="bg-white-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    1. Food Specification
                  </h3>

                  <div className="form-group">
                    <label className="form-label">Food Title / Description *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Vegetarian Wedding Buffet: Saffron Rice, Paneer Curry & Naan"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid-2" style={{ gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-control"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Dietary Classification *</label>
                      <select
                        className="form-control"
                        value={formData.dietaryType}
                        onChange={(e) => setFormData({ ...formData, dietaryType: e.target.value })}
                        required
                      >
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Eggitarian">Eggitarian</option>
                        <option value="Halal">Halal</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-2" style={{ gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Quantity *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                        min="1"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Unit *</label>
                      <select
                        className="form-control"
                        value={formData.quantityUnit}
                        onChange={(e) => setFormData({ ...formData, quantityUnit: e.target.value })}
                        required
                      >
                        <option value="servings">servings / meals</option>
                        <option value="kg">kg (weight)</option>
                        <option value="boxes">boxes / crates</option>
                        <option value="packets">packets / units</option>
                        <option value="liters">liters</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Additional Preparation Notes</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Mention ingredients, packaging containers, heating state..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* Allergens Selection */}
                  <div className="form-group">
                    <label className="form-label">Allergens Present</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.3rem' }}>
                      {['Dairy', 'Gluten', 'Nuts', 'Soy', 'Eggs', 'Seafood'].map((alg) => {
                        const checked = formData.allergens.includes(alg);
                        return (
                          <button
                            type="button"
                            key={alg}
                            onClick={() => handleAllergenToggle(alg)}
                            className={`badge ${checked ? 'badge-rose' : 'badge-slate'}`}
                            style={{ cursor: 'pointer', padding: '0.3rem 0.65rem' }}
                          >
                            {checked ? `✓ ${alg}` : `+ ${alg}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Storage & Expiry */}
                <div className="bg-white-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    2. Storage & Expiry Timing
                  </h3>

                  <div className="form-group">
                    <label className="form-label">Storage Condition *</label>
                    <select
                      className="form-control"
                      value={formData.storageCondition}
                      onChange={(e) => setFormData({ ...formData, storageCondition: e.target.value })}
                      required
                    >
                      <option value="Ambient (Room Temp)">Ambient (Room Temp)</option>
                      <option value="Refrigerated (0-4°C)">Refrigerated (0-4°C)</option>
                      <option value="Frozen (-18°C)">Frozen (-18°C)</option>
                      <option value="Insulated Hot Container">Insulated Hot Container (&gt;60°C)</option>
                    </select>
                  </div>

                  <div className="grid-2" style={{ gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Cooked Time</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={formData.cookedTime}
                        onChange={(e) => setFormData({ ...formData, cookedTime: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Best Before / Expiry Time</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={formData.expiryTime}
                        onChange={(e) => setFormData({ ...formData, expiryTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Photos & Pickup Address */}
              <div>
                {/* Visual Preset Image Picker */}
                <div className="bg-white-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    3. Food Photos
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                    {PRESET_IMAGES.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Preset"
                        onClick={() => setFormData({ ...formData, selectedImage: img, customImageUrl: '' })}
                        style={{
                          width: '100%',
                          height: '65px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          border: formData.selectedImage === img && !formData.customImageUrl ? '3px solid var(--emerald-600)' : '2px solid transparent',
                        }}
                      />
                    ))}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Or Custom Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.customImageUrl}
                      onChange={(e) => setFormData({ ...formData, customImageUrl: e.target.value })}
                    />
                  </div>
                </div>

                {/* Pickup Address */}
                <div className="bg-white-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    4. Pickup Coordination
                  </h3>

                  <div className="form-group">
                    <label className="form-label">Street Address *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.65rem' }}>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Phone *</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Access / Gate Instructions</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.specialInstructions}
                      onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  disabled={submitting}
                >
                  <UtensilsCrossed size={18} /> {submitting ? 'Publishing Listing...' : 'Publish Food Donation'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateListing;
