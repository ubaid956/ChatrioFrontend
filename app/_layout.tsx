
import { Stack } from 'expo-router';
import { View, Dimensions, Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { GroupProvider } from '../context/GroupContext';
import { NotificationProvider } from '../context/NotificationContext';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { loadLanguage } from '../i18n';
import * as Notifications from 'expo-notifications';

const { height } = Dimensions.get('window');

// Configure notification handler for all platforms
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    console.log('📱 Handling notification:', notification);

    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: Platform.OS === 'ios',
      priority: Notifications.AndroidNotificationPriority.MAX,
    };
  },
});

export default function RootLayout() {
  useEffect(() => {
    loadLanguage();

    // Setup Android notification channels
    const setupAndroidNotifications = async () => {
      if (Platform.OS === 'android') {
        try {
          console.log('🔔 Setting up Android notification channels...');

          // Create default notification channel
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Default Notifications',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#0758C2',
            sound: 'default',
            enableVibrate: true,
            enableLights: true,
            showBadge: true,
            bypassDnd: true,
          });

          // Create chat messages channel
          await Notifications.setNotificationChannelAsync('chat-messages', {
            name: 'Chat Messages',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#0758C2',
            sound: 'default',
            enableVibrate: true,
            enableLights: true,
            showBadge: true,
            bypassDnd: true,
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            description: 'Notifications for new chat messages',
          });

          // Create high priority channel for important messages
          await Notifications.setNotificationChannelAsync('high-priority', {
            name: 'Important Messages',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 100, 100, 100, 100, 100],
            lightColor: '#FF0000',
            sound: 'default',
            enableVibrate: true,
            enableLights: true,
            showBadge: true,
            bypassDnd: true,
            description: 'High priority notifications that require immediate attention',
          });

          console.log('✅ Android notification channels configured successfully');

          // Verify channels were created
          try {
            const channels = await Notifications.getNotificationChannelsAsync();
            console.log('📱 Available notification channels:', channels.map(c => ({ id: c.id, name: c.name, importance: c.importance })));
          } catch (error) {
            console.log('⚠️ Could not verify notification channels:', error);
          }
        } catch (error) {
          console.error('❌ Error setting up Android notifications:', error);
        }
      }
    };

    setupAndroidNotifications();

    // Add notification listeners for debugging
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('🔔 Notification response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  return (
    <NotificationProvider>
      <GroupProvider>
        <PaperProvider>
          <View style={{ flex: 1, paddingTop: height * 0.05, backgroundColor: "white" }}>
            {/* 👇 Show only on Android */}
            {Platform.OS === "android" && (
              <StatusBar style="dark" backgroundColor="white" />
            )}

            <Stack screenOptions={{ headerShown: false }} />
          </View>
        </PaperProvider>
      </GroupProvider>
    </NotificationProvider>
  );
}
