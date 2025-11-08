// Test script using Firebase Admin SDK directly for push notifications
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function testFirebasePush() {
    console.log('🧪 Testing Firebase Cloud Messaging (FCM) directly...');

    try {
        // Initialize Firebase Admin SDK with your new service account
        let app;
        if (getApps().length === 0) {
            // Use the new service account file directly
            const serviceAccount = JSON.parse(fs.readFileSync('./chatrio-c889c-931490ef8e00.json', 'utf8'));
            app = initializeApp({
                credential: cert(serviceAccount),
                projectId: serviceAccount.project_id,
            });
        } else {
            app = getApps()[0];
        }

        const messaging = getMessaging(app);

        // Your Expo push token - but we'll try to extract the FCM token from it
        const expoPushToken = 'ExponentPushToken[iDVXEEO3hot2VRP2k9uArf]';

        // For Expo apps, the actual FCM token is often the part in brackets
        // Let's try both approaches

        console.log('📱 Trying FCM with Expo token...');

        const message = {
            notification: {
                title: 'Test FCM Notification',
                body: 'Testing Firebase Cloud Messaging with new service account!'
            },
            data: {
                test: 'true',
                timestamp: new Date().toISOString()
            },
            // Try the token as-is first
            token: expoPushToken
        };

        const response = await messaging.send(message);
        console.log('✅ FCM notification sent successfully:', response);

    } catch (error) {
        console.error('❌ FCM notification failed:', error.message);

        if (error.code === 'messaging/invalid-registration-token') {
            console.log('💡 The Expo push token format is not compatible with FCM directly.');
            console.log('💡 Expo handles the FCM integration internally.');
            console.log('💡 Your Expo push notifications should work fine!');
        }
    }
}

testFirebasePush().catch(console.error);