const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    type: {
        type: String,
        enum: ['Pothole', 'Garbage', 'Water Leakage', 'Streetlight', 'Road Damage', 'Other'],
        required: true
    },
    status: {
        type: String,
        enum: ['Reported', 'Verified', 'In Progress', 'Resolved'],
        default: 'Reported'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: String
    },
    imageUrl: { type: String, required: true },
    imageHash: { type: String }, // SHA-256 hash for exact duplicate detection
    reportedBy: { type: String, default: 'Anonymous' }, // User ID or 'Anonymous'
    assignedTo: { type: String, default: null }, // Email of the assigned worker
    tags: [String], // For duplicates or other flags
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    resolvedAt: Date
});

module.exports = mongoose.model('Issue', IssueSchema);
