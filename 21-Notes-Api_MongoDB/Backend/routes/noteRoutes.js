const express = require('express');
const Router = express.Router();

const notes = require('../models/Note.js');
const authMiddleware = require('../middleware/authMiddleware');

// Get only logged-in user's notes
Router.get('/notes', authMiddleware, async (req, res) => {
    const data = await notes.find({
        user: req.user.userId
    });

    res.status(200).json({
        message: 'Data Fetched',
        data: data
    });
});

// Create note for logged-in user
Router.post('/create-notes', authMiddleware, async (req, res) => {
    const { title, desc } = req.body;

    await notes.create({
        title,
        desc,
        user: req.user.userId
    });

    res.status(201).json({
        message: 'Data Added'
    });
});

// Get one note only if it belongs to logged-in user
Router.get('/notes/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    const data = await notes.findOne({
        _id: id,
        user: req.user.userId
    });

    if (!data) {
        return res.status(404).json({
            message: 'Note not found'
        });
    }

    res.status(200).json({
        message: 'Data fetched',
        data: data
    });
});

// Delete only user's own note
Router.delete('/notes/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    const data = await notes.findOneAndDelete({
        _id: id,
        user: req.user.userId
    });

    if (!data) {
        return res.status(404).json({
            message: 'Note not found'
        });
    }

    res.status(200).json({
        message: 'Deleted'
    });
});

// Update only user's own note
Router.put('/notes/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, desc } = req.body;

    const data = await notes.findOneAndUpdate(
        {
            _id: id,
            user: req.user.userId
        },
        {
            title,
            desc
        },
        {
            new: true
        }
    );

    if (!data) {
        return res.status(404).json({
            message: 'Note not found'
        });
    }

    res.status(200).json({
        message: 'Updated'
    });
});

// Patch only user's own note
Router.patch('/notes/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, desc } = req.body;

    const data = await notes.findOneAndUpdate(
        {
            _id: id,
            user: req.user.userId
        },
        {
            title,
            desc
        },
        {
            new: true
        }
    );

    if (!data) {
        return res.status(404).json({
            message: 'Note not found'
        });
    }

    res.status(200).json({
        message: 'Updated'
    });
});

module.exports = Router;