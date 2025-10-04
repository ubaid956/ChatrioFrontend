import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import { pushTokenManager } from "@/utils/pushTokenManager";

interface NotificationContextType {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    error: Error | null;
    registerPushToken: (userId: string, authToken: string) => Promise<boolean>;
    clearPushToken: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
}) => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] =
        useState<Notifications.Notification | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const notificationListener = useRef<Subscription>();
    const responseListener = useRef<Subscription>();

    useEffect(() => {
        // Load existing token on app start
        pushTokenManager.loadStoredToken().then((token) => {
            setExpoPushToken(token);
        });

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                console.log("🔔 Notification Received: ", notification);
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log(
                    "🔔 Notification Response: ",
                    JSON.stringify(response, null, 2),
                    JSON.stringify(response.notification.request.content.data, null, 2)
                );
                // Handle the notification response here
            });

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(
                    notificationListener.current
                );
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    const registerPushToken = async (userId: string, authToken: string): Promise<boolean> => {
        try {
            const success = await pushTokenManager.registerAndSync(userId, authToken);
            if (success) {
                const token = pushTokenManager.getCurrentToken();
                setExpoPushToken(token);
            }
            return success;
        } catch (error) {
            setError(error as Error);
            return false;
        }
    };

    const clearPushToken = async (): Promise<void> => {
        await pushTokenManager.clearToken();
        setExpoPushToken(null);
    };

    return (
        <NotificationContext.Provider
            value={{ expoPushToken, notification, error, registerPushToken, clearPushToken }}
        >
            {children}
        </NotificationContext.Provider>
    );
};