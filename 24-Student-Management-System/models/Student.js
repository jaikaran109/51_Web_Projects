
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    img: {
        type: String,
        required: [true, 'Student image is required'],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
    },
    roll: {
        type: Number,
        required: [true, 'Roll number is required'],
        unique: true,
        min: [1, 'Roll number must be greater than zero']
    },
    section: {
        type: String,
        required: [true, 'Section is required'],
        trim: true
    },
    marks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Marks'
    }]
});

const Students = mongoose.model('Students', studentSchema);

module.exports = Students;
