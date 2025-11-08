// Simple test to verify notification delivery
import { sendExpoPush } from './utils/push.js';

async function urgentTest() {
    console.log('🚨 URGENT: Testing notification delivery...');

    const result = await sendExpoPush('ExponentPushToken[iDVXEEO3hot2VRP2k9uArf]', {
        title: '🚨 URGENT TEST',
        body: 'Check your phone NOW! This notification should appear immediately.',
        data: { urgent: true, timestamp: Date.now() }
    });

    console.log('Result:', result);
    console.log('📱 Check your phone within 30 seconds!');
}

urgentTest();