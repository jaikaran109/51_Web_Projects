import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Listings from './pages/Listings';
import ListingDetails from './pages/ListingDetails';
import CreateListing from './pages/CreateListing';
import DonorDashboard from './pages/DonorDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';
import PickupTrackingPage from './pages/PickupTrackingPage';
import AdminDashboard from './pages/AdminDashboard';
import ImpactPage from './pages/ImpactPage';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetails />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/create-listing"
            element={
              <ProtectedRoute allowedRoles={['donor', 'admin']}>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor-dashboard"
            element={
              <ProtectedRoute allowedRoles={['donor', 'admin']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receiver-dashboard"
            element={
              <ProtectedRoute allowedRoles={['receiver', 'admin']}>
                <ReceiverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking/:id"
            element={
              <ProtectedRoute>
                <PickupTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
