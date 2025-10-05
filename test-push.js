// Test script to verify push notifications are working
import { sendExpoPush } from './utils/push.js';
import dotenv from 'dotenv';

dotenv.config();

async function testPushNotification() {
    console.log('🧪 Testing push notification...');
    console.log('🔑 Firebase service account loaded:', !!process.env.FIREBASE_SERVICE_ACCOUNT);

    // Test with a sample Expo push token format
    // Replace with a real token from your device for actual testing
    const testToken = 'ExponentPushToken[REPLACE_WITH_REAL_TOKEN_FROM_YOUR_DEVICE]';

    console.log('📱 Testing with token:', testToken.substring(0, 30) + '...');

    const result = await sendExpoPush(testToken, {
        title: 'Test Notification - Server Restarted',
        body: 'This is a test notification after fixing Firebase credentials!',
        data: {
            test: true,
            timestamp: new Date().toISOString(),
            serverRestarted: true
        },
        userId: 'test-user'
    });

    console.log('📱 Push notification result:', result);

    if (!result.success) {
        console.error('❌ Push notification failed. Common causes:');
        console.error('   1. Invalid or expired Expo push token');
        console.error('   2. Device not connected to internet');
        console.error('   3. App not installed on device');
        console.error('   4. Permission denied for notifications');
    } else {
        console.log('✅ Push notification sent successfully!');
    }
}

testPushNotification().catch(console.error);
