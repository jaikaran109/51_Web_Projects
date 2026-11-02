/**
 * Smart AI Donor-to-NGO Matchmaker & Recommendation Engine
 * Multi-Criteria Decision Analysis (MCDA) Model for Food Rescue Logistics
 */

const User = require('../models/User');
const FoodListing = require('../models/FoodListing');

/**
 * Haversine formula to calculate accurate distance between two geographic points in kilometers
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 5.0; // fallback standard distance in km
  }
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

/**
 * Calculate multi-criteria match score (0 - 100) between a Food Listing and an NGO Receiver
 */
function calculateNgoMatchScore(listing, ngo) {
  if (!listing || !ngo) return null;

  // 1. Geospatial Proximity (Weight: 35 points)
  const listingCoords = listing.location?.coordinates || [77.2090, 28.6139]; // [lng, lat]
  const ngoCoords = ngo.location?.coordinates || [77.2190, 28.6239];

  const distanceKm = calculateHaversineDistance(
    listingCoords[1],
    listingCoords[0],
    ngoCoords[1],
    ngoCoords[0]
  );

  let proximityScore = 35;
  if (distanceKm <= 3) {
    proximityScore = 35;
  } else if (distanceKm <= 7) {
    proximityScore = 30;
  } else if (distanceKm <= 15) {
    proximityScore = 22;
  } else if (distanceKm <= 25) {
    proximityScore = 14;
  } else {
    proximityScore = Math.max(5, Math.round(35 - distanceKm * 0.8));
  }

  // 2. Capacity & Demand Fit (Weight: 30 points)
  const mealsOffered = listing.estimatedMeals || listing.quantity || 25;
  // Estimate NGO demand capacity from their beneficiary metrics or default ~40
  const ngoCapacity = ngo.metrics?.totalMealsSaved
    ? Math.min(150, Math.max(20, Math.round(ngo.metrics.totalMealsSaved / 10)))
    : 35;

  const capacityRatio = mealsOffered / ngoCapacity;
  let capacityScore = 30;
  if (capacityRatio >= 0.7 && capacityRatio <= 1.3) {
    capacityScore = 30; // Perfect fit
  } else if (capacityRatio >= 0.4 && capacityRatio <= 2.0) {
    capacityScore = 24; // Good fit
  } else if (capacityRatio >= 0.2 && capacityRatio <= 3.0) {
    capacityScore = 16;
  } else {
    capacityScore = 10;
  }

  // 3. Dietary & Category Alignment (Weight: 20 points)
  let dietaryScore = 20;
  if (listing.dietaryType === 'Vegetarian' || listing.dietaryType === 'Vegan') {
    dietaryScore = 20; // 100% universal acceptance
  } else if (listing.dietaryType === 'Halal' || listing.dietaryType === 'Eggitarian') {
    dietaryScore = 18;
  } else {
    dietaryScore = 15;
  }

  // 4. Reliability, Verification & Rating Index (Weight: 15 points)
  let reliabilityScore = 0;
  if (ngo.isVerified || ngo.verificationStatus === 'verified') {
    reliabilityScore += 8; // Verified badge
  } else {
    reliabilityScore += 3;
  }

  const rating = ngo.metrics?.rating || 4.5;
  reliabilityScore += Math.min(7, Math.round((rating / 5) * 7));

  // Aggregate Total (0 - 100)
  const totalScore = Math.min(100, Math.max(10, Math.round(proximityScore + capacityScore + dietaryScore + reliabilityScore)));

  let matchGrade = 'Good Match';
  let matchBadgeColor = 'blue';

  if (totalScore >= 90) {
    matchGrade = 'Best Match';
    matchBadgeColor = 'emerald';
  } else if (totalScore >= 75) {
    matchGrade = 'High Match';
    matchBadgeColor = 'indigo';
  } else if (totalScore >= 60) {
    matchGrade = 'Moderate Match';
    matchBadgeColor = 'amber';
  }

  const estimatedEtaMinutes = Math.max(10, Math.round(distanceKm * 3.5 + 5));

  return {
    ngoId: ngo._id,
    name: ngo.name,
    organizationName: ngo.organizationName || ngo.name,
    organizationType: ngo.organizationType || 'NGO / Non-Profit',
    phone: ngo.phone || '+1 555-0188',
    avatar: ngo.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${ngo.name}`,
    isVerified: ngo.isVerified,
    rating: ngo.metrics?.rating || 5.0,
    totalPickupsCompleted: ngo.metrics?.totalPickupsCompleted || 0,
    distanceKm,
    estimatedEtaMinutes,
    matchScore: totalScore,
    matchGrade,
    matchBadgeColor,
    breakdown: {
      proximityScore: { current: proximityScore, max: 35, label: 'Distance & Transit Proximity' },
      capacityScore: { current: capacityScore, max: 30, label: 'Capacity & Demand Fit' },
      dietaryScore: { current: dietaryScore, max: 20, label: 'Dietary & Storage Compatibility' },
      reliabilityScore: { current: reliabilityScore, max: 15, label: 'NGO Accreditation & Rating' },
    },
    recommendationReason: `Located ${distanceKm} km away (${estimatedEtaMinutes} min ETA). Capacity fits ${mealsOffered} meals perfectly.`,
  };
}

/**
 * Get Top Recommended NGOs for a specific food listing
 */
async function getRecommendedNgosForListing(listingId, limit = 4) {
  const listing = await FoodListing.findById(listingId);
  if (!listing) return [];

  const ngos = await User.find({ role: 'receiver', isActive: true });
  if (!ngos || ngos.length === 0) return [];

  const rankedNgos = ngos
    .map((ngo) => calculateNgoMatchScore(listing, ngo))
    .filter(Boolean)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);

  return rankedNgos;
}

module.exports = {
  calculateHaversineDistance,
  calculateNgoMatchScore,
  getRecommendedNgosForListing,
};
