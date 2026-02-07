const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const multer = require('multer');
const path = require('path');
const { checkDuplicates } = require('../utils/duplicateDetector');

const { checkFakeImage } = require('../utils/fakeImageCheck');
const crypto = require('crypto');
const fs = require('fs');

// Storage for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create an Issue
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, description, type, lat, lng, address, reportedBy } = req.body;

        // 1. Fake Image Check (Stub)
        if (req.file) {
            const isFake = await checkFakeImage(req.file.path);
            if (isFake) {
                return res.status(400).json({ error: 'Potential fake or irrelevant image detected.' });
            }
        }

        // 2. Image Hash Duplicate Check (Exact Image Match)
        let fileHash = '';
        if (req.file) {
            const fileBuffer = fs.readFileSync(req.file.path);
            const hashSum = crypto.createHash('sha256');
            hashSum.update(fileBuffer);
            fileHash = hashSum.digest('hex');

            const existingImage = await Issue.findOne({ imageHash: fileHash });
            if (existingImage) {
                // Delete the uploaded duplicate file to save space
                fs.unlinkSync(req.file.path);

                return res.status(200).json({
                    message: 'Alert: This specific image has already been submitted to the admin.',
                    duplicateId: existingImage._id,
                    isDuplicate: true,
                    duplicateType: 'image'
                });
            }
        }

        // 2. Duplicate Detection
        const potentialDuplicate = await checkDuplicates({ lat, lng, type });
        if (potentialDuplicate) {
            return res.status(200).json({
                message: 'Duplicate suspected',
                duplicateId: potentialDuplicate._id,
                isDuplicate: true
            });
        }

        const newIssue = new Issue({
            title,
            description,
            type,
            location: { lat, lng, address },

            imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
            imageHash: fileHash,
            reportedBy
        });

        await newIssue.save();

        // Emit real-time event
        const io = req.app.get('io');
        io.emit('newIssue', newIssue);

        res.status(201).json(newIssue);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get All Issues (with filters)
router.get('/', async (req, res) => {
    try {
        const issues = await Issue.find().sort({ createdAt: -1 });
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Update Status (Admin/Worker)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const issue = await Issue.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        // Emit update
        const io = req.app.get('io');
        io.emit('issueUpdated', issue);

        res.json(issue);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Delete Issue (Admin Only - Logic handled by frontend access)
router.delete('/:id', async (req, res) => {
    try {
        await Issue.findByIdAndDelete(req.params.id);

        // Emit deletion
        const io = req.app.get('io');
        io.emit('issueDeleted', req.params.id);

        res.json({ message: 'Issue deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Assign Issue to Worker
router.patch('/:id/assign', async (req, res) => {
    try {
        const { assignedTo } = req.body; // Expects email
        const issue = await Issue.findByIdAndUpdate(
            req.params.id,
            { assignedTo, updatedAt: Date.now() },
            { new: true }
        );

        // Emit update
        const io = req.app.get('io');
        io.emit('issueUpdated', issue);

        res.json(issue);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
