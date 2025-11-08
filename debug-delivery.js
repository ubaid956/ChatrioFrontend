// Enhanced debug test to identify the exact issue
import { sendExpoPush } from './utils/push.js';
import dotenv from 'dotenv';

dotenv.config();

async function debugNotificationDelivery() {
    console.log('🔍 DEBUG: Comprehensive notification delivery test');
    console.log('================================================');

    const testToken = 'ExponentPushToken[iDVXEEO3hot2VRP2k9uArf]';

    console.log('📱 Token info:');
    console.log('  - Token type: Expo Push Token');
    console.log('  - Token valid format:', testToken.startsWith('ExponentPushToken['));
    console.log('  - Token length:', testToken.length);

    console.log('\n🔧 Server configuration:');
    console.log('  - Firebase service account loaded:', !!process.env.FIREBASE_SERVICE_ACCOUNT);

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            console.log('  - Project ID:', serviceAccount.project_id);
            console.log('  - Client Email:', serviceAccount.client_email);
            console.log('  - Private Key ID:', serviceAccount.private_key_id.substring(0, 10) + '...');
        } catch (e) {
            console.log('  - ❌ Invalid service account JSON');
        }
    }

    console.log('\n📤 Sending test notification...');

    const result = await sendExpoPush(testToken, {
        title: '🔍 Debug Test Notification',
        body: `Sent at ${new Date().toLocaleTimeString()} - Check delivery timing`,
        data: {
            debug: true,
            timestamp: Date.now(),
            test_id: Math.random().toString(36).substring(7),
            delivery_attempt: 'post_fcm_update'
        }
    });

    console.log('\n📊 Result analysis:');
    console.log('  - Send successful:', result.success);
    console.log('  - Full result:', JSON.stringify(result, null, 2));

    if (result.success && result.tickets) {
        console.log('\n✅ Notification sent to Expo service successfully!');
        console.log('📱 If you\'re not receiving notifications, the issue might be:');
        console.log('   1. App needs to be rebuilt with new FCM credentials');
        console.log('   2. Device notification permissions');
        console.log('   3. App state (needs to be running/background, not force-closed)');
        console.log('   4. Device connectivity or battery optimization');
        console.log('\n⏰ Check your device within the next 2 minutes...');
    } else {
        console.log('\n❌ Notification send failed at Expo level');
    }
}

debugNotificationDelivery().catch(console.error);