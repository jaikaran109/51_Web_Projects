const mongoose = require('mongoose');
const dns = require('dns');

// Fix Node.js DNS SRV resolution issues for MongoDB Atlas across all networks/ISPs
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']);
  if (typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (dnsErr) {
  console.warn('DNS server configuration warning:', dnsErr.message);
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_food_donation';
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      family: 4, // Force IPv4 to prevent IPv6 DNS timeout delays
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('⚠️ Make sure your MongoDB daemon is running locally or provide a valid MONGODB_URI in backend/.env');
    // Do not crash immediately in dev mode, allows server to provide helpful error responses
    return null;
  }
};

module.exports = connectDB;
