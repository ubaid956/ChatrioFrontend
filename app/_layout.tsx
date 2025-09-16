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

const { height } = Dimensions.get('window');

export default function RootLayout() {
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
