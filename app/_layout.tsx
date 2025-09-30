// import { Stack } from 'expo-router';

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" />
//       <Stack.Screen name="Splash" />

//       // Your entry point

//       <Stack.Screen name="Screens/Welcome" />
//       <Stack.Screen name="Screens/Login" />
//       <Stack.Screen name='(tabs)'/>
//       <Stack.Screen name="Screens/Signup" />
//       <Stack.Screen name="Screens/Login_2" />
//       <Stack.Screen name='Screens/ChatMessage' />
//     </Stack>
//   );
// }


// import { Stack } from 'expo-router';

// export default function RootLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false,
//       }}
//     />
//   );
// }

import { Stack } from 'expo-router';
import { View, Dimensions, Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { GroupProvider } from '../context/GroupContext';
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
        } catch (error) {
          console.error('❌ Error setting up Android notifications:', error);
        }
      }
    };

    setupAndroidNotifications();
  }, []);
  return (
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
  );
}
