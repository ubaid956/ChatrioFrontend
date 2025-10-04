import express from 'express';

import {
     register, login,
     googleSignIn,
     emailVerify, verifyOtp, updatePassword, getAllUsers, getUserById, profilePic, updateProfile, sendOtp, updatePushToken, getLoggedInUser, sendTestNotification, debugPushNotifications, sendAndroidNotificationTest
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleSignIn);

router.get('/users', protect, getAllUsers)

//get user by id and all the chats bw specific user and logged in user
router.get('/users/:id', protect, getUserById)

router.post('/users/forgot', emailVerify);


router.post('/users/verifyOtp', verifyOtp);
router.patch('/users/updatePassword', updatePassword);

// router.post('/users/profile', protect, profilePic)
router.put('/users/profile', protect, updateProfile);
router.post('/users/sendotp', sendOtp)
router.post('/updatePushToken', updatePushToken);

router.get('/me', protect, getLoggedInUser);

// Test push notification endpoint
router.post('/test-notification', sendTestNotification);

// Debug push notification setup
router.post('/debug-notifications', debugPushNotifications);

// Android-specific notification testing
router.post('/test-android-notifications', sendAndroidNotificationTest);


export default router;