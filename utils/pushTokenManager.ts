import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync } from './registerForPushNotificationsAsync';

const API_BASE_URL = 'https://chatrio-backend.onrender.com/api/auth';

/**
 * Centralized push token management
 * Handles registration, storage, and backend synchronization
 */
export class PushTokenManager {
    private static instance: PushTokenManager;
    private currentToken: string | null = null;

    private constructor() { }

    static getInstance(): PushTokenManager {
        if (!PushTokenManager.instance) {
            PushTokenManager.instance = new PushTokenManager();
        }
        return PushTokenManager.instance;
    }

    /**
     * Register for push notifications and sync with backend
     * @param userId - User ID to associate the token with
     * @param authToken - Authentication token for API calls
     * @returns Promise<boolean> - Success status
     */
    async registerAndSync(userId: string, authToken: string): Promise<boolean> {
        try {
            console.log('🔄 Starting push token registration and sync...');

            // 1. Get push token from Expo
            const pushToken = await registerForPushNotificationsAsync();
            if (!pushToken) {
                console.warn('⚠️ No push token received from Expo');
                return false;
            }

            console.log('📱 Expo push token received:', pushToken);

            // 2. Store token locally
            await AsyncStorage.setItem('pushToken', pushToken);
            this.currentToken = pushToken;

            // 3. Sync with backend
            const success = await this.syncWithBackend(userId, pushToken, authToken);

            if (success) {
                console.log('✅ Push token registration and sync completed successfully');
            } else {
                console.error('❌ Failed to sync push token with backend');
            }

            return success;
        } catch (error) {
            console.error('❌ Push token registration failed:', error);
            return false;
        }
    }

    /**
     * Sync push token with backend
     * @param userId - User ID
     * @param pushToken - Push token to sync
     * @param authToken - Authentication token
     * @returns Promise<boolean> - Success status
     */
    private async syncWithBackend(userId: string, pushToken: string, authToken: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/updatePushToken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ userId, pushToken })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const result = await response.json();
            console.log('📤 Push token synced with backend:', result);
            return result.success;
        } catch (error) {
            console.error('❌ Backend sync failed:', error);
            return false;
        }
    }

    /**
     * Get current push token
     * @returns string | null
     */
    getCurrentToken(): string | null {
        return this.currentToken;
    }

    /**
     * Load stored push token from AsyncStorage
     * @returns Promise<string | null>
     */
    async loadStoredToken(): Promise<string | null> {
        try {
            const token = await AsyncStorage.getItem('pushToken');
            this.currentToken = token;
            return token;
        } catch (error) {
            console.error('❌ Failed to load stored push token:', error);
            return null;
        }
    }

    /**
     * Clear push token (logout scenario)
     */
    async clearToken(): Promise<void> {
        try {
            await AsyncStorage.removeItem('pushToken');
            this.currentToken = null;
            console.log('🧹 Push token cleared');
        } catch (error) {
            console.error('❌ Failed to clear push token:', error);
        }
    }

    /**
     * Check if push token is valid
     * @param token - Token to validate
     * @returns boolean
     */
    isValidToken(token: string | null): boolean {
        if (!token) return false;

        // Check for Expo push token format
        return token.startsWith('ExponentPushToken[') ||
            token.startsWith('ExpoPushToken[') ||
            token.length > 10; // Basic length check for other formats
    }
}

// Export singleton instance
export const pushTokenManager = PushTokenManager.getInstance();
