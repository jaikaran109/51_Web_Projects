import React from 'react';
import { Search, Map, LayoutGrid, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Cooked Meals',
  'Bakery & Bread',
  'Raw Groceries',
  'Fruits & Vegetables',
  'Packaged & Canned',
  'Dairy & Eggs',
  'Beverages',
  'Mixed Assortment',
];

const ListingFilters = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  selectedDiet,
  setSelectedDiet,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  resetFilters,
}) => {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      {/* Top Search Bar & Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-dim)',
            }}
          />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search surplus food, donor, cuisine, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters Group */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <select
            className="form-control"
            style={{ width: 'auto', padding: '0.65rem 0.75rem' }}
            value={selectedDiet}
            onChange={(e) => setSelectedDiet(e.target.value)}
          >
            <option value="all">All Diets</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Non-Vegetarian">Non-Veg</option>
            <option value="Eggitarian">Eggitarian</option>
          </select>

          <select
            className="form-control"
            style={{ width: 'auto', padding: '0.65rem 0.75rem' }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="Available">Available (Claimable)</option>
            <option value="all">All Statuses</option>
            <option value="Requested">Claim Requested</option>
            <option value="Accepted">Accepted</option>
            <option value="Picked Up">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>

          <select
            className="form-control"
            style={{ width: 'auto', padding: '0.65rem 0.75rem' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="urgency">Sort: High Urgency</option>
            <option value="createdAt">Sort: Newest First</option>
            <option value="expiry">Sort: Expiry Soonest</option>
            <option value="quantity">Sort: Quantity</option>
          </select>

          {/* View Toggle */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.2rem',
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.4rem 0.7rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.8rem',
                background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : 'var(--text-muted)',
              }}
            >
              <LayoutGrid size={14} /> Grid
            </button>
            <button
              onClick={() => setViewMode('map')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.4rem 0.7rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.8rem',
                background: viewMode === 'map' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'map' ? '#ffffff' : 'var(--text-muted)',
              }}
            >
              <Map size={14} /> Map
            </button>
          </div>

          <button
            onClick={resetFilters}
            className="btn btn-secondary btn-sm"
            style={{ height: '36px' }}
            title="Reset filters"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div
        style={{
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          paddingBottom: '0.35rem',
        }}
      >
        {CATEGORIES.map((cat) => {
          const value = cat === 'All' ? 'all' : cat;
          const isSelected = selectedCategory === value;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(value)}
              style={{
                background: isSelected ? 'var(--text-main)' : 'var(--bg-card)',
                color: isSelected ? 'var(--text-inverse)' : 'var(--text-secondary)',
                border: `1px solid ${isSelected ? 'var(--text-main)' : 'var(--border-subtle)'}`,
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ListingFilters;
