
const express = require('express');
const Router = express.Router();
const Students = require('../models/Student');
const { body, validationResult } = require('express-validator');

// Escape special characters in search input
const escapeRegex = (value) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Validate student form data
const validateStudent = [
    body('name')
        .trim()
        .notEmpty().withMessage('Student name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must contain 2 to 50 characters'),

    body('img')
        .trim()
        .notEmpty().withMessage('Image URL is required')
        .isURL({ require_protocol: true })
        .withMessage('Please enter a valid image URL'),

    body('roll')
        .trim()
        .notEmpty().withMessage('Roll number is required')
        .isInt({ min: 1 })
        .withMessage('Roll number must be a positive integer')
        .toInt(),

    body('section')
        .trim()
        .notEmpty().withMessage('Section is required')
        .isLength({ max: 10 })
        .withMessage('Section cannot exceed 10 characters')
];

// Display home page
Router.get('/', (req, res) => {
    res.render('Students/main');
});

// Student listing with search and pagination
Router.get('/students', async (req, res) => {
    const search = (req.query.search || '').trim();
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = 10;

    const filter = {};

    if (search) {
        const safeSearch = escapeRegex(search);

        filter.$or = [
            { name: { $regex: safeSearch, $options: 'i' } }
        ];

        if (/^\d+$/.test(search)) {
            filter.$or.push({ roll: Number(search) });
        }
    }

    const totalStudents = await Students.countDocuments(filter);
    const totalPages = Math.ceil(totalStudents / limit);
    const currentPage = totalPages
        ? Math.min(page, totalPages)
        : 1;

    const data = await Students.find(filter)
        .sort({ name: 1 })
        .skip((currentPage - 1) * limit)
        .limit(limit);

    res.render('Students/index', {
        data,
        search,
        currentPage,
        totalPages,
        totalStudents
    });
});

// Display new student form
Router.get('/student/new', (req, res) => {
    res.render('Students/new', { errors: [], formData: {} });
});

// Create student
Router.post('/students', validateStudent, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render('Students/new', {
            errors: errors.array(),
            formData: req.body
        });
    }

    const { img, name, roll, section } = req.body;

    const existingStudent = await Students.findOne({ roll });

    if (existingStudent) {
        return res.status(400).render('Students/new', {
            errors: [{ msg: 'This roll number is already registered' }],
            formData: req.body
        });
    }

    try {
        await Students.create({ img, name, roll, section });
        res.redirect('/students');
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).render('Students/new', {
                errors: [{ msg: 'This roll number is already registered' }],
                formData: req.body
            });
        }
        throw error;
    }
});

// Display student details
Router.get('/students/:id', async (req, res) => {
    const { id } = req.params;
    const stu = await Students.findById(id).populate('marks');
    res.render('Students/show', { stu });
});

// Display edit form
Router.get('/students/:id/edit', async (req, res) => {
    const { id } = req.params;
    const stu = await Students.findById(id);
    res.render('Students/edit', { stu, errors: [] });
});

// Update student
Router.patch('/students/:id', validateStudent, async (req, res) => {
    const errors = validationResult(req);
    const { id } = req.params;

    const stu = await Students.findById(id);

    if (!stu) {
        return res.status(404).send('Student not found');
    }

    if (!errors.isEmpty()) {
        return res.status(400).render('Students/edit', {
            stu: { ...stu.toObject(), ...req.body },
            errors: errors.array()
        });
    }

    const { img, name, roll, section } = req.body;

    const existingStudent = await Students.findOne({
        roll,
        _id: { $ne: id }
    });

    if (existingStudent) {
        return res.status(400).render('Students/edit', {
            stu: { ...stu.toObject(), ...req.body },
            errors: [{ msg: 'This roll number is already registered' }]
        });
    }

    try {
        await Students.findByIdAndUpdate(id, {
            img,
            name,
            roll,
            section
        }, { runValidators: true });

        res.redirect(`/students/${id}`);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).render('Students/edit', {
                stu: { ...stu.toObject(), ...req.body },
                errors: [{ msg: 'This roll number is already registered' }]
            });
        }
        throw error;
    }
});

// Delete student
Router.delete('/students/:id', async (req, res) => {
    const { id } = req.params;
    await Students.findByIdAndDelete(id);
    res.redirect('/students');
});

module.exports = Router;
