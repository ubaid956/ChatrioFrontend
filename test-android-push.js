// Enhanced test with Android-specific settings
import { sendExpoPush } from './utils/push.js';
import dotenv from 'dotenv';

dotenv.config();

async function testAndroidPush() {
    console.log('🧪 Testing Android push notification...');

    const testToken = 'ExponentPushToken[iDVXEEO3hot2VRP2k9uArf]';

    const result = await sendExpoPush(testToken, {
        title: 'Android Test 🔔',
        body: 'Testing with Android-optimized settings',
        data: {
            test: true,
            timestamp: new Date().toISOString(),
            action: 'test_notification'
        }
    });

    console.log('📱 Push result:', result);

    // Try a second notification with different settings
    if (result.success) {
        console.log('⏳ Sending second test notification in 3 seconds...');

        setTimeout(async () => {
            const result2 = await sendExpoPush(testToken, {
                title: 'Second Test 📱',
                body: 'If you see this, notifications are working!',
                data: {
                    test: true,
                    notification_id: Date.now()
                }
            });
            console.log('📱 Second push result:', result2);
        }, 3000);
    }
}

testAndroidPush().catch(console.error);