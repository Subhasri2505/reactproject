const Issue = require('../models/Issue');

// Haversine formula to find distance between two points
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

const DUPLICATE_DISTANCE_THRESHOLD_KM = 0.05; // 50 meters
const DUPLICATE_TIME_THRESHOLD_HOURS = 24;

async function checkDuplicates({ lat, lng, type }) {
    // Find issues of same type created recently
    const timeThreshold = new Date(Date.now() - DUPLICATE_TIME_THRESHOLD_HOURS * 60 * 60 * 1000);

    const recentIssues = await Issue.find({
        type: type,
        createdAt: { $gte: timeThreshold },
        status: { $ne: 'Resolved' } // Only check open issues
    });

    for (let issue of recentIssues) {
        const distance = getDistanceFromLatLonInKm(lat, lng, issue.location.lat, issue.location.lng);
        if (distance <= DUPLICATE_DISTANCE_THRESHOLD_KM) {
            return issue; // Found a duplicate
        }
    }

    return null;
}

module.exports = { checkDuplicates };
