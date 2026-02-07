const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role, name) => {
    return jwt.sign({ id, role, name }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body; // Role allows creating admins for demo
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'User already exists' });

        const user = await User.create({ name, email, password, role });
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role, user.name),
        });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role, user.name),
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get All Workers (for Admin)
router.get('/workers', async (req, res) => {
    try {
        const workers = await User.find({ role: 'worker' }).select('-password');
        res.json(workers);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
