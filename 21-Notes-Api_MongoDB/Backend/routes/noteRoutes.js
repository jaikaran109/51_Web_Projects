const express = require('express');

const Note = require('../models/Note.js');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require auth
router.use(authMiddleware);

/* ----------------------------- helpers ----------------------------- */

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;
const TITLE_MAX = 200;
const DESC_MAX = 10000;

// Express 4 doesn't catch rejected promises, so wrap every async handler
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Reject malformed ids early (avoids Mongoose CastError -> 500)
const validateId = (req, res, next) => {
    if (!OBJECT_ID_RE.test(req.params.id)) {
        return res.status(400).json({ message: 'Invalid note id' });
    }
    next();
};

// Validates title/desc. Returns { error } or { value }.
// partial = true -> fields optional (PATCH), but at least one must be present.
const parseNoteBody = (body = {}, { partial = false } = {}) => {
    const value = {};
    const { title, desc } = body;

    if (title !== undefined) {
        if (typeof title !== 'string' || !title.trim()) {
            return { error: 'title must be a non-empty string' };
        }
        if (title.trim().length > TITLE_MAX) {
            return { error: `title must be at most ${TITLE_MAX} characters` };
        }
        value.title = title.trim();
    }

    if (desc !== undefined) {
        if (typeof desc !== 'string') {
            return { error: 'desc must be a string' };
        }
        if (desc.length > DESC_MAX) {
            return { error: `desc must be at most ${DESC_MAX} characters` };
        }
        value.desc = desc;
    }

    if (partial) {
        if (Object.keys(value).length === 0) {
            return { error: 'Provide at least one of: title, desc' };
        }
    } else if (value.title === undefined || value.desc === undefined) {
        return { error: 'title and desc are required' };
    }

    return { value };
};

const sendNotFound = (res) =>
    res.status(404).json({ message: 'Note not found' });

/* ------------------------------ routes ------------------------------ */

// List the logged-in user's notes (paginated, newest first)
// GET /notes?page=1&limit=20
router.get(
    '/notes',
    asyncHandler(async (req, res) => {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

        const filter = { user: req.user.userId };

        const [data, total] = await Promise.all([
            Note.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Note.countDocuments(filter),
        ]);

        res.status(200).json({
            message: 'Data fetched',
            data,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    })
);

// Create a note
// POST /notes  (POST /create-notes kept as an alias so existing clients don't break)
router.post(
    ['/notes', '/create-notes'],
    asyncHandler(async (req, res) => {
        const { error, value } = parseNoteBody(req.body);
        if (error) return res.status(400).json({ message: error });

        const data = await Note.create({ ...value, user: req.user.userId });

        res.status(201).json({ message: 'Data added', data });
    })
);

// Get one note (only if it belongs to the user)
router.get(
    '/notes/:id',
    validateId,
    asyncHandler(async (req, res) => {
        const data = await Note.findOne({
            _id: req.params.id,
            user: req.user.userId,
        }).lean();

        if (!data) return sendNotFound(res);

        res.status(200).json({ message: 'Data fetched', data });
    })
);

// Full update: title and desc both required
router.put(
    '/notes/:id',
    validateId,
    asyncHandler(async (req, res) => {
        const { error, value } = parseNoteBody(req.body);
        if (error) return res.status(400).json({ message: error });

        const data = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            { $set: value },
            { new: true, runValidators: true }
        ).lean();

        if (!data) return sendNotFound(res);

        res.status(200).json({ message: 'Updated', data });
    })
);

// Partial update: any of title/desc
router.patch(
    '/notes/:id',
    validateId,
    asyncHandler(async (req, res) => {
        const { error, value } = parseNoteBody(req.body, { partial: true });
        if (error) return res.status(400).json({ message: error });

        const data = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            { $set: value },
            { new: true, runValidators: true }
        ).lean();

        if (!data) return sendNotFound(res);

        res.status(200).json({ message: 'Updated', data });
    })
);

// Delete a note
router.delete(
    '/notes/:id',
    validateId,
    asyncHandler(async (req, res) => {
        const data = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!data) return sendNotFound(res);

        res.status(200).json({ message: 'Deleted' });
    })
);

/* ------------------------- error handling -------------------------- */

// Catches anything thrown/rejected above; never leaks internals to the client
// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid value provided' });
    }

    console.error('[notes.routes]', err);
    res.status(500).json({ message: 'Internal server error' });
});

module.exports = router;