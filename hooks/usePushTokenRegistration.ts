import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotification } from '@/context/NotificationContext';

/**
 * Hook to automatically register push tokens when user is authenticated
 * This should be used in the main app screens after login
 */
export const usePushTokenRegistration = () => {
    const { registerPushToken, expoPushToken } = useNotification();

    useEffect(() => {
        const registerTokenIfNeeded = async () => {
            try {
                // Get user data from AsyncStorage
                const userToken = await AsyncStorage.getItem('userToken');
                const userId = await AsyncStorage.getItem('userId');

                // Only register if we have authentication data and no existing token
                if (userToken && userId && !expoPushToken) {
                    console.log('🔄 Auto-registering push token for authenticated user...');
                    const success = await registerPushToken(userId, userToken);

                    if (success) {
                        console.log('✅ Push token auto-registration successful');
                    } else {
                        console.warn('⚠️ Push token auto-registration failed');
                    }
                } else if (expoPushToken) {
                    console.log('📱 Push token already registered:', expoPushToken);
                } else {
                    console.log('⏭️ Skipping push token registration - user not authenticated');
                }
            } catch (error) {
                console.error('❌ Error in push token auto-registration:', error);
            }
        };

        registerTokenIfNeeded();
    }, [registerPushToken, expoPushToken]);

    return { expoPushToken };
};
