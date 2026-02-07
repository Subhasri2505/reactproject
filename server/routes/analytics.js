const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');

// Get Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        const totalIssues = await Issue.countDocuments();
        const resolvedIssues = await Issue.countDocuments({ status: 'Resolved' });
        const pendingIssues = await Issue.countDocuments({ status: { $ne: 'Resolved' } });

        // Group by Type
        const issuesByType = await Issue.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        // Group by Status
        const issuesByStatus = await Issue.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            total: totalIssues,
            resolved: resolvedIssues,
            pending: pendingIssues,
            byType: issuesByType,
            byStatus: issuesByStatus
        });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Heatmap Data (All locations)
router.get('/heatmap', async (req, res) => {
    try {
        const points = await Issue.find({}, 'location priority type'); // Select specific fields
        res.json(points);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
