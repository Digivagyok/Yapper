import express from 'express';
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

// In-memory storage for subscriptions (Replace with DB in production)
const subscriptions = new Map();

// Subscribe endpoint
router.post('/subscribe', (req, res) => {
    const { userId, endpoint, keys } = req.body;

    if (!userId || !endpoint || !keys) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get existing subscriptions or initialize an empty array
    const userSubscriptions = subscriptions.get(userId) || [];

    // Check if this device is already subscribed (prevent duplicates)
    const exists = userSubscriptions.some(sub => sub.endpoint === endpoint);
    if (!exists) {
        userSubscriptions.push({ endpoint, keys });
    }

    // Save updated subscriptions
    subscriptions.set(userId, userSubscriptions);

    res.status(201).json({ message: 'Subscription successful' });
});

export default router;
