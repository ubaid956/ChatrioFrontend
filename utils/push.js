import { Expo } from 'expo-server-sdk';
const expo = new Expo();

export async function sendExpoPush(to, { title, body, data }) {
    if (!Expo.isExpoPushToken(to)) {
        console.log('Invalid token:', to);
        return;
    }
    try {
        await expo.sendPushNotificationsAsync([{
            to,
            sound: 'default',
            title,
            body,
            data
        }]);
    } catch (err) {
        console.error('Push error:', err);
    }
}
