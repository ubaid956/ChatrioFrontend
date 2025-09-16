// // screens/PhoneAuthScreen.js
// import React, { useState } from 'react';
// import { View, TextInput, Button, Alert } from 'react-native';
// import { auth } from '../../firebaseConfig';
// import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

// const PhoneAuthScreen = ({ navigation }) => {
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [verificationId, setVerificationId] = useState(null);

//   const recaptchaVerifier = React.useRef(null);

//   const sendVerification = async () => {
//     try {
//       const phoneProvider = new PhoneAuthProvider(auth);
//       const verificationId = await phoneProvider.verifyPhoneNumber(
//         phone,
//         recaptchaVerifier.current
//       );
//       setVerificationId(verificationId);
//       Alert.alert('OTP Sent');
//     } catch (error) {
//       Alert.alert(error.message);
//     }
//   };

//   const confirmCode = async () => {
//     try {
//       const credential = PhoneAuthProvider.credential(verificationId, otp);
//       await signInWithCredential(auth, credential);
//       navigation.replace('/(tabs)/chats');
//     } catch (error) {
//       Alert.alert('Invalid OTP');
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <FirebaseRecaptchaVerifierModal
//         ref={recaptchaVerifier}
//         firebaseConfig={auth.app.options}
//       />

//       <TextInput
//         placeholder="Enter phone number"
//         onChangeText={setPhone}
//         keyboardType="phone-pad"
//         style={{ marginVertical: 10, borderBottomWidth: 1 }}
//       />
//       <Button title="Send OTP" onPress={sendVerification} />

//       <TextInput
//         placeholder="Enter OTP"
//         onChangeText={setOtp}
//         keyboardType="number-pad"
//         style={{ marginVertical: 10, borderBottomWidth: 1 }}
//       />
//       <Button title="Confirm OTP" onPress={confirmCode} />
//     </View>
//   );
// };

// export default PhoneAuthScreen;


// import { useState, useEffect } from 'react';
// import { Button, TextInput } from 'react-native';
// import { getAuth, onAuthStateChanged, signInWithPhoneNumber } from '@react-native-firebase/auth';
// import { SafeAreaView } from 'react-native-safe-area-context';
// function PhoneAuthScreen() {
//     // If null, no SMS has been sent
//     const [confirm, setConfirm] = useState(null);

//     // verification code (OTP - One-Time-Passcode)
//     const [code, setCode] = useState('');

//     // Handle login
//     function handleAuthStateChanged(user) {
//         if (user) {
//             // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
//             // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
//             // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
//             // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
//         }
//     }

//     useEffect(() => {
//         const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
//         return subscriber; // unsubscribe on unmount
//     }, []);

//     // Handle the button press
//     async function handleSignInWithPhoneNumber(phoneNumber) {
//         const confirmation = await signInWithPhoneNumber(getAuth(), phoneNumber);
//         setConfirm(confirmation);
//     }

//     async function confirmCode() {
//         try {
//             await confirm.confirm(code);
//         } catch (error) {
//             console.log('Invalid code.');
//         }
//     }

//     if (initializing) return null;

//     if (!user) {
//         if (!confirm) {
//             return (
//                 <SafeAreaView>
//                     <Button
//                         title="Phone Number Sign In"
//                         onPress={() => handleSignInWithPhoneNumber('+92 3047796880')}
//                     />
//                 </SafeAreaView>

//             );
//         }

//         return (
//             <>
//                 <TextInput value={code} onChangeText={text => setCode(text)} />
//                 <Button title="Confirm Code" onPress={() => confirmCode()} />
//             </>
//         );
//     }

//     return (
//         <View>
//             <Text>Welcome {user.email}</Text>
//         </View>
//     );


// }
// export default PhoneAuthScreen;



//This is working properly 

// import React, { useState, useEffect } from 'react';
// import { View, Button, TextInput, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import { getAuth, onAuthStateChanged, signInWithPhoneNumber } from '@react-native-firebase/auth';
// import { SafeAreaView } from 'react-native-safe-area-context';

// function PhoneAuthScreen() {
//   const [confirm, setConfirm] = useState(null);
//   const [code, setCode] = useState('');
//   const [user, setUser] = useState(null);
//   const [initializing, setInitializing] = useState(true);
//   const [error, setError] = useState(null);

//   // Monitor auth state
//   useEffect(() => {
//     const subscriber = onAuthStateChanged(getAuth(), (user) => {
//       setUser(user);
//       if (initializing) setInitializing(false);
//     });
//     return subscriber; // unsubscribe on unmount
//   }, []);

//   // Sign in with phone number
//   async function handleSignInWithPhoneNumber(phoneNumber) {
//     try {
//       const confirmation = await signInWithPhoneNumber(getAuth(), phoneNumber);
//       setConfirm(confirmation);
//       setError(null);
//     } catch (err) {
//       setError('Failed to send OTP. Please check the number.');
//     }
//   }

//   // Confirm the code
//   async function confirmCode() {
//     try {
//       await confirm.confirm(code);
//       setError(null);
//     } catch (err) {
//       setError('Invalid code. Please try again.');
//     }
//   }

//   if (initializing) {
//     return (
//       <SafeAreaView style={styles.centered}>
//         <ActivityIndicator size="large" color="#000" />
//       </SafeAreaView>
//     );
//   }

//   if (!user) {
//     return (
//       <SafeAreaView style={styles.container}>
//         {!confirm ? (
//           <>
//             <Text style={styles.title}>Sign In with Phone</Text>
//             <Button
//               title="Send OTP to +92 3047796880"
//               onPress={() => handleSignInWithPhoneNumber('+92 3047796880')}
//             />
//             {error && <Text style={styles.error}>{error}</Text>}
//           </>
//         ) : (
//           <>
//             <Text style={styles.title}>Enter Verification Code</Text>
//             <TextInput
//               value={code}
//               onChangeText={setCode}
//               placeholder="Enter OTP"
//               keyboardType="number-pad"
//               style={styles.input}
//             />
//             <Button title="Confirm Code" onPress={confirmCode} disabled={code.length === 0} />
//             {error && <Text style={styles.error}>{error}</Text>}
//           </>
//         )}
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.centered}>
//       <Text style={styles.welcome}>Welcome, you're logged in!</Text>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     flex: 1,
//     justifyContent: 'center',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#aaa',
//     borderRadius: 8,
//     padding: 10,
//     marginVertical: 15,
//     fontSize: 16,
//   },
//   title: {
//     fontSize: 20,
//     marginBottom: 15,
//     fontWeight: '600',
//   },
//   error: {
//     color: 'red',
//     marginTop: 10,
//   },
//   welcome: {
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
// });

// export default PhoneAuthScreen;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
} from '@react-native-firebase/auth';
// import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

function PhoneAuthScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
      if (user) {
        // navigation.replace('WelcomeScreen'); // 👈 go to welcome on success

        router.replace('/Screens/Signup'); // 👈 go to chats on success
      }
    });

    return unsubscribe;
  }, []);

  const handleSendCode = async () => {
    if (!phoneNumber) {
      Alert.alert('Please enter a phone number');
      return;
    }

    try {
      setLoading(true);
      const confirmation = await signInWithPhoneNumber(getAuth(), phoneNumber);
      setConfirm(confirmation);
      setError(null);
    } catch (err) {
      console.log('OTP send error:', err);
      setError('Failed to send OTP. Check the number or setup.');
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    try {
      setLoading(true);
      await confirm.confirm(code);
      setError(null);
    } catch (err) {
      console.log('OTP verify error:', err);
      setError('Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!confirm ? (
        <>
          <Text style={styles.title}>Enter Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+92XXXXXXXXXX"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Button title="Send OTP" onPress={handleSendCode} disabled={loading} />
          {error && <Text style={styles.error}>{error}</Text>}
        </>
      ) : (
        <>
          <Text style={styles.title}>Enter OTP Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit code"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />
          <Button title="Verify OTP" onPress={confirmCode} disabled={loading || code.length < 6} />
          {error && <Text style={styles.error}>{error}</Text>}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default PhoneAuthScreen;
