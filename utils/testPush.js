import { Expo } from 'expo-server-sdk';

const expo = new Expo();

/**
 * Test function to debug push notification issues
 */
export async function testExpoPush(token, { title, body, data }) {
    console.log('🧪 Testing Expo push notification...');
    console.log('Token:', token);
    console.log('Is Expo token:', Expo.isExpoPushToken(token));

    const message = {
        to: token,
        sound: 'default',
        title,
        body,
        data,
        priority: 'high',
        android: {
            channelId: 'default',
            sound: 'default',
            priority: 'high',
            vibrate: [0, 250, 250, 250],
            notification: {
                color: '#0758C2',
                sticky: false,
                tag: `test-${Date.now()}`,
                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                visibility: 'public',
                lights: true,
                lightColor: '#0758C2'
            }
        },
        ios: {
            sound: 'default',
            badge: 1
        }
    };

    console.log('📤 Sending message:', JSON.stringify(message, null, 2));

    try {
        const chunks = expo.chunkPushNotifications([message]);
        console.log('📦 Chunks created:', chunks.length);

        const tickets = [];
        for (let chunk of chunks) {
            console.log('📤 Sending chunk...');
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log('📥 Chunk response:', ticketChunk);
            tickets.push(...ticketChunk);
        }

        console.log('🎫 All tickets:', tickets);

        for (let ticket of tickets) {
            if (ticket.status === 'error') {
                console.error('❌ Ticket error:', ticket);
                return { success: false, error: ticket.message, details: ticket.details };
            }
        }

        console.log('✅ Test notification sent successfully');
        return { success: true, tickets };
    } catch (err) {
        console.error('❌ Test notification failed:', err);
        return { success: false, error: err?.message || String(err) };
    }
}
