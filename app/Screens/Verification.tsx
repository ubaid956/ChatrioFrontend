
//Working perfectly 

// import { View, Text, Alert, TouchableOpacity, ActivityIndicator } from 'react-native'
// import React, { useState } from 'react'
// import LoginHeader from '../Components/LoginHeader'
// import Box from '../Components/Box'
// import CustomButton from '../Components/CustomButton'
// import { useRouter } from 'expo-router';

// const Verification = () => {

//   const router = useRouter()
//   const [otp, setOtp] = useState('')  // You'll need to update your Box component to accept onChangeText or similar to update OTP
//   const [isLoading, setIsLoading] = useState(false);
//   const handleVerify = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('https://32b5245c5f10.ngrok-free.app/api/auth/users/verifyOtp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ OTP: otp }), // ✅ Use "OTP" (uppercase)
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         Alert.alert('Verification Failed', data.message || 'Invalid OTP');
//         return;
//       }

//       // ✅ OTP verified, pass userId to NewPassword screen
//       // navigation.navigate('Signup-Login/NewPassword', {
//       //   userId: data.userId,
//       // })
//       router.push({
//         pathname: '/Screens/NewPassword',
//         params: {
//           userId: data.userId,
//         },
//       });


//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong. Please try again.');
//       console.error('OTP Verification error:', error);
//     } finally {
//       setIsLoading(false);
//     }


//     // router.push('Screens/NewPassword')

//   };


//   return (
//     <View>
//       <LoginHeader
//         title="Verification"
//         subtitle="Enter the code sent to your email or phone number"
//         onPress={() => router.back()}
//       />

//       <Box value={otp} onChangeText={setOtp} />

//       {/* <CustomButton title="Verify" onPress={handleVerify} /> */}

//       <CustomButton
//         title={
//           isLoading ? (
//             <ActivityIndicator size="small" color="white" />
//           ) : (
//             "Verify"
//           )
//         }
//         onPress={handleVerify}
//         disabled={isLoading}
//       />
//       <TouchableOpacity>


//         <Text style={{ textAlign: 'center', marginTop: 20 }}>
//           Didn't receive the code? <Text style={{ color: '#0758C2' }}>Resend</Text>
//         </Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

// export default Verification



import { View, Text, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import LoginHeader from '../Components/LoginHeader';
import Box from '../Components/Box';
import CustomButton from '../Components/CustomButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Verification = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const phoneNumber = Array.isArray(params.phoneNumber) ? params.phoneNumber[0] : (params.phoneNumber as string) || 'your phone';
  const next = Array.isArray(params.next) ? params.next[0] : (params.next as string | undefined); // 'login' | 'signup'


  const handleVerify = async () => {
    setIsLoading(true);

    try {
      // Basic validation
      const code = otp.trim();
      if (code.length < 6) {
        Alert.alert('Invalid code', 'Please enter the 6-digit code.');
        return;
      }

      // Get verificationId from AsyncStorage
      const confirmationData = await AsyncStorage.getItem('firebaseConfirmation');
      if (!confirmationData) {
        Alert.alert('Error', 'Session expired. Please try again.');
        return;
      }

      const { verificationId } = JSON.parse(confirmationData);
      if (!verificationId) {
        Alert.alert('Error', 'Missing verification ID');
        return;
      }

      // Verify with Firebase using verificationId and code
      const credential = auth.PhoneAuthProvider.credential(verificationId, code);
      const userCred = await auth().signInWithCredential(credential);
      const idToken = await userCred.user.getIdToken();

      // Clear the stored confirmation data
      await AsyncStorage.removeItem('firebaseConfirmation');

      if (next === 'login') {
        const resp = await fetch('https://32b5245c5f10.ngrok-free.app/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phoneNumber.replace('+', ''), // Remove + for database storage
            firebaseToken: idToken
          })
        });

        // Check if response is JSON
        const contentType = resp.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const textResponse = await resp.text();
          console.error('Non-JSON response:', textResponse);
          Alert.alert('Login failed', 'Server returned invalid response. Please try again.');
          return;
        }

        const payload = await resp.json();
        if (!resp.ok) {
          Alert.alert('Login failed', payload.message || 'Unable to login');
          return;
        }
        await AsyncStorage.setItem('userToken', payload.token);
        await AsyncStorage.setItem('userId', payload._id);
        await AsyncStorage.setItem('userData', JSON.stringify(payload));

        // --- PUSH TOKEN LOGIC START ---
        try {
          const Notifications = await import('expo-notifications');
          const Device = await import('expo-device');
          let pushToken = null;
          if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
              const { status } = await Notifications.requestPermissionsAsync();
              finalStatus = status;
            }
            if (finalStatus === 'granted') {
              pushToken = (await Notifications.getExpoPushTokenAsync()).data;
              // Save push token to backend
              await fetch('https://32b5245c5f10.ngrok-free.app/api/auth/updatePushToken', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: payload._id, pushToken })
              });
            }
          }
        } catch (pushErr) {
          console.warn('Failed to update push token after phone login:', pushErr);
        }
        // --- PUSH TOKEN LOGIC END ---

        router.replace('/(tabs)/chats');
        return;
      }

      if (next === 'signup') {
        const resp = await fetch('https://32b5245c5f10.ngrok-free.app/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: Array.isArray(params.fullName) ? params.fullName[0] : (params.fullName as string),
            email: Array.isArray(params.email) ? params.email[0] : (params.email as string),
            phone: phoneNumber.replace('+', ''), // Remove + for database storage
            password: Array.isArray(params.password) ? params.password[0] : (params.password as string),
          })
        });

        // Check if response is JSON
        const contentType = resp.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const textResponse = await resp.text();
          console.error('Non-JSON response:', textResponse);
          Alert.alert('Signup failed', 'Server returned invalid response. Please try again.');
          return;
        }

        const payload = await resp.json();
        if (!resp.ok) {
          Alert.alert('Signup failed', payload.message || 'Unable to create account');
          return;
        }
        await AsyncStorage.setItem('userToken', payload.token);
        await AsyncStorage.setItem('userId', payload._id);
        await AsyncStorage.setItem('userData', JSON.stringify(payload));
        router.replace('/(tabs)/chats');
        return;
      }

      Alert.alert('Error', 'Invalid flow');
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
      console.error('OTP Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <LoginHeader
        title="Verification"
        subtitle={`Enter the code sent to ${phoneNumber}`}
        onPress={() => router.back()}
      />

      <Box value={otp} onChangeText={setOtp} />

      <CustomButton
        title={
          isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            "Verify"
          )
        }
        onPress={handleVerify}
        disabled={isLoading || otp.length < 6}
      />

      <TouchableOpacity onPress={() => {
        // Implement resend logic here
        Alert.alert('OTP Resent', 'A new OTP has been sent to your phone');
      }}>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          Didn’t receive the code? <Text style={{ color: '#0758C2' }}>Resend</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Verification;