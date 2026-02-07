const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/civic-issues';

async function seed() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const usersToSeed = [
            {
                name: 'City Admin',
                email: 'admin@city.gov',
                password: 'adminpassword',
                role: 'admin'
            },
            {
                name: 'Field Worker 1',
                email: 'worker@city.gov',
                password: 'workerpassword',
                role: 'worker'
            }
        ];

        for (const userData of usersToSeed) {
            const exists = await User.findOne({ email: userData.email });
            if (!exists) {
                await User.create(userData);
                console.log(`User created: ${userData.email}`);
            } else {
                console.log(`User already exists: ${userData.email}`);
            }
        }

        console.log('Seeding Complete');
    } catch (error) {
        console.error('Seeding Error:', error.message);
        if (error.errors) {
            console.error('Validation Errors:', Object.keys(error.errors).map(key => error.errors[key].message));
        }
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
}

seed();
