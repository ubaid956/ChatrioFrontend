// Add this route to your server temporarily for testing
import express from 'express';
import { sendExpoPush } from '../utils/push.js';

const router = express.Router();

// Temporary endpoint to receive and test fresh push tokens
router.post('/test-token', async (req, res) => {
    try {
        const { token, device } = req.body;

        console.log('🔑 Received fresh token from device:', device);
        console.log('📱 Token:', token);

        // Test notification immediately
        const result = await sendExpoPush(token, {
            title: '🎉 Fresh Token Test!',
            body: `Token received from ${device || 'device'} at ${new Date().toLocaleTimeString()}`,
            data: {
                test: true,
                token_test: true,
                timestamp: Date.now()
            }
        });

        console.log('📊 Notification result:', result);

        res.json({
            success: true,
            message: 'Token received and test notification sent',
            notification_result: result
        });

    } catch (error) {
        console.error('❌ Token test error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;