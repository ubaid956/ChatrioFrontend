import { Expo } from 'expo-server-sdk';

const expo = new Expo();

/**
 * Send push using Expo push service for both Android and iOS.
 * Only works with valid Expo push tokens.
 */
export async function sendExpoPush(to, { title, body, data, userId = null }) {
    if (!to) {
        console.log(`Invalid or missing push token for user ${userId}:`, to);
        return { success: false, error: 'Invalid push token' };
    }

    // If it's an Expo push token, send via Expo service
    if (Expo.isExpoPushToken(to)) {
        try {
            console.log(`Sending Expo push notification to user ${userId} (${to}):`, { title, body });

            const messages = [{
                to,
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
                        tag: `notification-${Date.now()}`,
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
            }];

            const chunks = expo.chunkPushNotifications(messages);
            const tickets = [];

            for (let chunk of chunks) {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            }

            for (let ticket of tickets) {
                if (ticket.status === 'error') {
                    console.error(`Push notification error for user ${userId}:`, ticket.message, ticket.details || 'no details');
                    return { success: false, error: ticket.message, details: ticket.details };
                }
            }

            console.log(`\u2705 Expo push notification sent successfully to user ${userId}`);
            return { success: true, tickets };
        } catch (err) {
            console.error(`\u274c Expo push notification failed for user ${userId}:`, err);
            return { success: false, error: err?.message || String(err) };
        }
    }

    // If token is not an Expo push token, return error
    console.log(`Token for user ${userId} is not an Expo token. Token sample: ${String(to).slice(0, 40)}...`);
    return { success: false, error: 'Token is not a valid Expo push token' };
}

// Function to send push notifications to multiple users
export async function sendMultipleExpoPush(recipients) {
    const results = [];

    for (const recipient of recipients) {
        const { pushToken, title, body, data, userId } = recipient;
        const result = await sendExpoPush(pushToken, { title, body, data, userId });
        results.push({ userId, ...result });
    }

    return results;
}
