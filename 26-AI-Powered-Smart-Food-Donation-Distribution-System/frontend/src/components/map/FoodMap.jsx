import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Utensils, MapPin, Clock, Users, ArrowRight } from 'lucide-react';

// Fix default Leaflet marker icon issue in React bundles
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Food Listing Marker Pin
const createCustomIcon = (urgencyScore = 50) => {
  const color = urgencyScore >= 80 ? '#f59e0b' : '#10b981';
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${color};
        color: #fff;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        border: 3px solid #ffffff;
        font-size: 16px;
      ">
        🍲
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 12);
    }
  }, [center, map]);
  return null;
};

const FoodMap = ({ listings = [], height = '520px', initialCenter = [28.6139, 77.2090] }) => {
  return (
    <div
      style={{
        height,
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <MapContainer
        center={initialCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeMapView center={initialCenter} />

        {listings.map((item) => {
          // Extract coords from listing
          const coords = item.location?.coordinates;
          if (!coords || coords.length !== 2) return null;
          // Leaflet expects [lat, lng], GeoJSON stores [lng, lat]
          const latLng = [coords[1], coords[0]];

          return (
            <Marker
              key={item._id}
              position={latLng}
              icon={createCustomIcon(item.urgencyScore)}
            >
              <Popup>
                <div style={{ padding: '0.4rem', minWidth: '220px' }}>
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                    alt={item.title}
                    style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }}
                  />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.3rem 0', color: '#0f172a' }}>
                    {item.title}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>
                    <strong>{item.donorOrg || item.donorName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#0f172a', fontWeight: 600, marginBottom: '0.6rem' }}>
                    <span>📦 {item.quantity} {item.quantityUnit}</span>
                    <span style={{ color: '#10b981' }}>👥 Feeds ~{item.estimatedMeals || item.quantity}</span>
                  </div>
                  <Link
                    to={`/listings/${item._id}`}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: '#10b981',
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: '0.4rem',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    View & Claim Donation
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default FoodMap;
