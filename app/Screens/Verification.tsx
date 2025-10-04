


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

      // --- PUSH TOKEN LOGIC START ---
      if (next === 'login') {
        const resp = await fetch('https://chatrio-backend.onrender.com/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phoneNumber.replace('+', ''), // Remove + for database storage (971525554980)
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
          const { registerForPushNotificationsAsync } = await import('@/utils/registerForPushNotificationsAsync');
          const pushToken = await registerForPushNotificationsAsync();
          if (pushToken) {
            await fetch('https://chatrio-backend.onrender.com/api/auth/updatePushToken', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: payload._id, pushToken })
            });
          }
        } catch (pushErr) {
          console.warn('Failed to update push token after Google login:', pushErr);
        }
        // --- PUSH TOKEN LOGIC END ---

        router.replace('/(tabs)/chats');
        return;
      }

      if (next === 'signup') {
        const resp = await fetch('https://chatrio-backend.onrender.com/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: Array.isArray(params.fullName) ? params.fullName[0] : (params.fullName as string),
            email: Array.isArray(params.email) ? params.email[0] : (params.email as string),
            phone: phoneNumber.replace('+', ''), // Remove + for database storage (971525554980)
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

        // --- PUSH TOKEN LOGIC START ---
        try {
          const { registerForPushNotificationsAsync } = await import('@/utils/registerForPushNotificationsAsync');
          const pushToken = await registerForPushNotificationsAsync();
          if (pushToken) {
            await fetch('https://chatrio-backend.onrender.com/api/auth/updatePushToken', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: payload._id, pushToken })
            });
            console.log('✅ Push token registered for new user:', payload._id);
          }
        } catch (pushErr) {
          console.warn('Failed to register push token after signup:', pushErr);
        }
        // --- PUSH TOKEN LOGIC END ---

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
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
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