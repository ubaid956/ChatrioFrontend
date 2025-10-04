import { sendExpoPush } from './push.js';
import { onlineUsers } from './socket.js';
import User from '../models/User.js';
import Group from '../models/Group.js';

/**
 * Check if a user is currently online based on socket connections
 * @param {string} userId - The user ID to check
 * @returns {boolean} - True if user is online, false otherwise
 */
export function isUserOnline(userId) {
    const userSockets = onlineUsers.get(userId.toString());
    const isOnline = Boolean(userSockets && userSockets.size > 0);
    console.log(`🔍 isUserOnline check for ${userId}: ${isOnline} (sockets: ${userSockets?.size || 0})`);
    return isOnline;
}

/**
 * Send a notification to a user if they're offline
 * @param {Object} params - Notification parameters
 * @param {string} params.userId - Target user ID
 * @param {string} params.title - Notification title
 * @param {string} params.body - Notification body
 * @param {Object} params.data - Additional notification data
 * @param {boolean} params.forceNotification - Send even if user is online
 * @returns {Object} - Result of notification attempt
 */
export async function sendNotificationIfOffline({ userId, title, body, data, forceNotification = false }) {
    try {
        console.log(`🔔 sendNotificationIfOffline called for user: ${userId}, forceNotification: ${forceNotification}`);

        // Safety check: If this is a group message or feature, ensure we don't send to sender
        if (data && (data.type === 'group_message' || data.type === 'group_feature') && data.senderId) {
            if (userId.toString() === data.senderId.toString()) {
                console.log(`🚨 SAFETY CHECK: Preventing notification to sender ${userId} for ${data.type}`);
                return { success: false, error: 'Sender notification blocked', skipped: true };
            }
        }

        const user = await User.findById(userId, 'pushToken name lastActive');
        if (!user) {
            console.log(`❌ User not found: ${userId}`);
            return { success: false, error: 'User not found' };
        }

        if (!user.pushToken) {
            console.log(`❌ No push token for user: ${user.name} (${userId})`);
            return { success: false, error: 'No push token available' };
        }

        // Check if user is online (unless forcing notification)
        const isOnline = isUserOnline(userId);
        console.log(`📱 User ${user.name} (${userId}) is online: ${isOnline}`);

        if (!forceNotification && isOnline) {
            console.log(`⏭️ Skipping notification for online user: ${user.name} (${userId})`);
            return { success: false, error: 'User is online', skipped: true };
        }

        // Send push notification
        console.log(`📤 Sending push notification to ${user.name} (${userId}): "${title}" - "${body}"`);
        const result = await sendExpoPush(user.pushToken, {
            title,
            body,
            data,
            userId
        });

        console.log(`📱 Push notification result for ${user.name}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
        return {
            success: result.success,
            error: result.error,
            userName: user.name
        };

    } catch (error) {
        console.error(`Error sending notification to user ${userId}:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Send private message notification
 * @param {Object} params - Notification parameters
 * @param {string} params.recipientId - Recipient user ID
 * @param {string} params.senderName - Name of the message sender
 * @param {string} params.messageText - The message text or description
 * @param {string} params.messageId - Message ID for navigation
 * @param {string} params.senderId - Sender user ID
 * @returns {Object} - Result of notification attempt
 */
export async function sendPrivateMessageNotification({ recipientId, senderName, messageText, messageId, senderId }) {
    return await sendNotificationIfOffline({
        userId: recipientId,
        title: senderName,
        body: messageText,
        data: {
            type: 'private_message',
            messageId: messageId.toString(),
            senderId: senderId.toString(),
            senderName
        },
        forceNotification: true  // Always send notifications for private messages
    });
}

/**
 * Send group message notifications to all members (excluding sender)
 * @param {Object} params - Notification parameters
 * @param {string} params.groupId - Group ID
 * @param {string} params.senderId - Sender user ID
 * @param {string} params.senderName - Name of the message sender
 * @param {string} params.messageText - The message text or description
 * @param {string} params.messageId - Message ID for navigation
 * @returns {Array} - Results of all notification attempts
 */
export async function sendGroupMessageNotifications({ groupId, senderId, senderName, messageText, messageId }) {
    try {
        const group = await Group.findById(groupId).populate('members', 'pushToken name _id');
        if (!group) {
            throw new Error('Group not found');
        }

        console.log(`🔔 Processing group notifications for "${group.name}" (${group.members.length} members)`);
        console.log(`📤 Sender ID: ${senderId} (${senderName})`);

        const senderIdStr = senderId.toString();
        const results = [];

        for (const member of group.members) {
            const memberIdStr = member._id.toString();
            console.log(`👤 Processing member: ${member.name} (ID: ${memberIdStr})`);

            // Skip sender
            if (memberIdStr === senderIdStr) {
                console.log(`⏭️ SKIPPING notification to sender: ${member.name} (ID: ${memberIdStr})`);
                continue;
            }

            // Double-check: Ensure we never send notification to sender
            if (memberIdStr === senderIdStr) {
                console.log(`🚨 DOUBLE-CHECK: Preventing notification to sender ${member.name} (${memberIdStr})`);
                continue;
            }

            const result = await sendNotificationIfOffline({
                userId: memberIdStr,
                title: group.name,
                body: `${senderName}: ${messageText}`,
                data: {
                    type: 'group_message',
                    groupId: groupId.toString(),
                    messageId: messageId.toString(),
                    senderId: senderIdStr,
                    senderName,
                    groupName: group.name
                },
                forceNotification: true  // Always send notifications for group messages (same as private messages)
            });

            results.push({
                memberId: memberIdStr,
                memberName: member.name,
                ...result
            });

            if (result.success) {
                console.log(`✅ Push notification sent to ${member.name}`);
            } else {
                console.log(`❌ Failed to send push notification to ${member.name}: ${result.error}`);
            }
        }

        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        console.log(`📊 Group notification summary: ${successful} sent, ${failed} failed`);

        return results;

    } catch (error) {
        console.error('Error sending group message notifications:', error);
        throw error;
    }
}

/**
 * Validate and sanitize push token
 * @param {string} pushToken - The push token to validate
 * @returns {boolean} - True if token is valid
 */
export function isValidPushToken(pushToken) {
    return pushToken &&
        typeof pushToken === 'string' &&
        (pushToken.startsWith('ExponentPushToken[') ||
            pushToken.startsWith('ExpoPushToken[') ||
            pushToken.match(/^[a-zA-Z0-9_-]+$/)); // Basic token format validation
}

/**
 * Send group feature notification to all members (excluding sender)
 * @param {Object} params - Notification parameters
 * @param {string} params.groupId - Group ID
 * @param {string} params.senderId - Sender user ID
 * @param {string} params.senderName - Name of the feature creator
 * @param {string} params.featureType - Type of feature (task, poll, assignment, etc.)
 * @param {string} params.featureTitle - Title of the feature
 * @param {string} params.featureId - Feature ID for navigation
 * @returns {Array} - Results of all notification attempts
 */
export async function sendGroupFeatureNotification({ groupId, senderId, senderName, featureType, featureTitle, featureId }) {
    try {
        const group = await Group.findById(groupId).populate('members', 'pushToken name _id');
        if (!group) {
            throw new Error('Group not found');
        }

        console.log(`🔔 Processing group feature notifications for "${group.name}" (${group.members.length} members)`);
        console.log(`📤 Feature: ${featureType} - "${featureTitle}" by ${senderName} (${senderId})`);

        const senderIdStr = senderId.toString();
        const results = [];

        // Create notification message based on feature type
        const getNotificationMessage = (type, title, creator) => {
            const featureEmojis = {
                task: '📋',
                idea: '💡',
                note: '📝',
                poll: '📊',
                meeting: '📅',
                assignment: '📚',
                quiz: '🧠',
                resource: '📎',
                shopping: '🛒',
                budget: '💰',
                chore: '🧹',
                event: '📅',
                itinerary: '🗺️',
                checklist: '✅',
                expense: '💸',
                document: '📄',
                location: '📍'
            };

            const emoji = featureEmojis[type] || '📌';
            return `${emoji} ${creator} created ${type}: ${title}`;
        };

        const notificationBody = getNotificationMessage(featureType, featureTitle, senderName);

        for (const member of group.members) {
            const memberIdStr = member._id.toString();
            console.log(`👤 Processing member: ${member.name} (ID: ${memberIdStr})`);

            // Skip sender
            if (memberIdStr === senderIdStr) {
                console.log(`⏭️ SKIPPING notification to sender: ${member.name} (ID: ${memberIdStr})`);
                continue;
            }

            const result = await sendNotificationIfOffline({
                userId: memberIdStr,
                title: group.name,
                body: notificationBody,
                data: {
                    type: 'group_feature',
                    groupId: groupId.toString(),
                    featureId: featureId.toString(),
                    featureType,
                    senderId: senderIdStr,
                    senderName,
                    groupName: group.name
                },
                forceNotification: true  // Always send notifications for group features
            });

            results.push({
                memberId: memberIdStr,
                memberName: member.name,
                ...result
            });

            if (result.success) {
                console.log(`✅ Feature notification sent to ${member.name}`);
            } else {
                console.log(`❌ Failed to send feature notification to ${member.name}: ${result.error}`);
            }
        }

        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        console.log(`📊 Group feature notification summary: ${successful} sent, ${failed} failed`);

        return results;

    } catch (error) {
        console.error('Error sending group feature notifications:', error);
        throw error;
    }
}

/**
 * Clean up invalid push tokens from user records
 * @param {string} userId - User ID to clean up
 * @returns {boolean} - True if token was removed
 */
export async function cleanupInvalidPushToken(userId) {
    try {
        const user = await User.findById(userId);
        if (user && user.pushToken && !isValidPushToken(user.pushToken)) {
            user.pushToken = null;
            await user.save();
            console.log(`🧹 Cleaned up invalid push token for user ${userId}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error cleaning up push token for user ${userId}:`, error);
        return false;
    }
}