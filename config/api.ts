// API Configuration
// Update this URL when you get a new ngrok tunnel

export const API_BASE_URL = 'https://chatrio-backend.onrender.com';

// API Endpoints
export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        GOOGLE_LOGIN: `${API_BASE_URL}/api/auth/google`,
        UPDATE_PUSH_TOKEN: `${API_BASE_URL}/api/auth/updatePushToken`,
        USERS: `${API_BASE_URL}/api/auth/users`,
        PROFILE: `${API_BASE_URL}/api/auth/users/profile`,
        FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/users/forgot`,
        UPDATE_PASSWORD: `${API_BASE_URL}/api/auth/users/updatePassword`,
        VERIFY_OTP: `${API_BASE_URL}/api/auth/users/verifyOtp`,
        TEST_NOTIFICATION: `${API_BASE_URL}/api/auth/test-notification`,
        DEBUG_NOTIFICATIONS: `${API_BASE_URL}/api/auth/debug-notifications`,
    },

    // Message endpoints
    MESSAGES: {
        PRIVATE: `${API_BASE_URL}/api/messages/private`,
        GROUP: `${API_BASE_URL}/api/messages/group`,
        GROUP_MESSAGES: (groupId: string, groupType: string) =>
            `${API_BASE_URL}/api/messages/${groupId}/${groupType.toLowerCase()}`,
    },

    // Group endpoints
    GROUPS: {
        BASE: `${API_BASE_URL}/api/groups`,
        GROUP_USERS: (groupId: string) => `${API_BASE_URL}/api/groups/${groupId}/users`,
        GROUP_BY_TYPE: (groupType: string) => `${API_BASE_URL}/api/groups/${groupType}`,
    },

    // Socket URL
    SOCKET: API_BASE_URL,
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;
