const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'notes-api-secret';

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Authentication required'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
}

module.exports = authMiddleware;