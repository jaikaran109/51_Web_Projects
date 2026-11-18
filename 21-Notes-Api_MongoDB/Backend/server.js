const express = require('express');
const connectDb = require('./config/db');
const noteRoutes = require('./routes/noteRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
const CORS = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

connectDb();

// Middlewares
app.use(helmet());
app.use(express.json());

// Comma separated list in CORS_ORIGINS, the Vite dev server by default.
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    CORS({
        origin(origin, callback) {
            // No Origin header means a same-origin or non-browser request.
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(null, false);
        },
    }),
);

// Slow down password guessing on register and login.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many attempts, try again later' },
});
app.use(['/register', '/login'], authLimiter);

// Routes
app.use(authRoutes);
app.use(noteRoutes);

const PORT = 5050;

app.listen(PORT, () => {
    console.log(`Server is Running at ${PORT}`);
});