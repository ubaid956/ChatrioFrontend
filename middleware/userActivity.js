import User from '../models/User.js';

/**
 * Middleware to update user's last active timestamp
 * Should be used after authentication middleware
 */
export const updateLastActive = async (req, res, next) => {
    // Only update if user is authenticated
    if (req.user && req.user._id) {
        try {
            // Update last active timestamp without waiting for the operation to complete
            User.findByIdAndUpdate(
                req.user._id,
                { lastActive: new Date() },
                { new: false } // Don't return the updated document to save resources
            ).exec().catch(error => {
                console.error('Error updating user last active:', error);
            });
        } catch (error) {
            console.error('Error in updateLastActive middleware:', error);
        }
    }

    next();
};

/**
 * Middleware to track push token updates
 * Validates and cleans up push tokens
 */
export const validatePushToken = async (req, res, next) => {
    if (req.body.pushToken) {
        const token = req.body.pushToken.trim();

        // Basic validation for Expo push tokens
        if (token && (token.startsWith('ExponentPushToken[') || token.startsWith('ExpoPushToken['))) {
            req.body.pushToken = token;
        } else if (token.length === 0) {
            req.body.pushToken = null;
        } else {
            console.warn('Invalid push token format received:', token);
            req.body.pushToken = null;
        }
    }

    next();
};