// import { Redirect } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { connectSocket, getSocket } from '@/utils/socket';
// import * as Notifications from "expo-notifications";
// import { Alert, Platform } from 'react-native';
// import * as Device from 'expo-device';
// import axios from 'axios';

// const BASE_URL = "https://32b5245c5f10.ngrok-free.app/";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// // Function to schedule custom styled notification
// async function sendCustomNotification(title: string, body: string, data: any = {}) {
//   let content: Notifications.NotificationContentInput = { title, body, data, sound: "default" };

//   if (Platform.OS === "android") {
//     content = {
//       ...content,
//       color: "#FF0000",
//       smallIcon: "notification_icon", // in android/res/drawable
//       priority: Notifications.AndroidNotificationPriority.HIGH,
//       vibrationPattern: [0, 250, 250, 250],
//       sticky: false,
//     };
//   } else if (Platform.OS === "ios") {
//     const asset = Asset.fromModule(require('../assets/images/chatrio_logo_trans.png'));
//     await asset.downloadAsync();

//     content = {
//       ...content,
//       attachments: [
//         { url: asset.localUri || asset.uri, identifier: 'app_icon' },
//       ],
//       badge: 1,
//     };
//   }

//   await Notifications.scheduleNotificationAsync({ content, trigger: null });
// }

// export default function Index() {
//   const [redirectTo, setRedirectTo] = useState<string | null>(null);

//   const registerForPushNotificationsAsync = async () => {
//     if (!Device.isDevice) {
//       Alert.alert('Must use a physical device for Push Notifications');
//       return null;
//     }

//     if (Platform.OS === 'android') {
//       await Notifications.setNotificationChannelAsync('default', {
//         name: 'default',
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: '#FF231F7C',
//       });
//     }

//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== 'granted') {
//       Alert.alert('Failed to get push token for notifications!');
//       return null;
//     }

//     const token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log("Expo Push Token:", token);
//     return token;
//   };

//   const savePushTokenToBackend = async (userId: string, pushToken: string) => {
//     try {
//       const res = await axios.post(`${BASE_URL}/api/auth/updatePushToken`, { userId, pushToken });
//       console.log("Push token saved:", res.data);
//       await sendCustomNotification("Login Successful ✅", "Push notifications enabled!", { userId });
//     } catch (err: any) {
//       console.error("Error saving push token:", err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     const initApp = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const userId = await AsyncStorage.getItem('userId');
//         const userData = await AsyncStorage.getItem('userData');

//         if (token && userId && userData) {
//           const pushToken = await registerForPushNotificationsAsync();
//           if (pushToken) await savePushTokenToBackend(userId, pushToken);

//           connectSocket(userId);
//           const socket = getSocket();
//           socket.emit("register", { userId, pushToken });

//           setRedirectTo('/(tabs)/chats');
//         } else {
//           setRedirectTo('/Splash');
//         }
//       } catch (error) {
//         console.error("Error initializing app", error);
//         setRedirectTo('/Splash');
//       }
//     };

//     initApp();
//   }, []);

//   if (!redirectTo) return null;
//   return <Redirect href={redirectTo} />;
// }


// import { Redirect } from 'expo-router';


// import Login from './Screens/Login';
// export default function Index() {

//   return <Redirect href="/Screens/PhoneAuthScreen" />;
// }




// this is working properly
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import {
//   getAuth,
//   onAuthStateChanged,
//   signInWithPhoneNumber,
// } from '@react-native-firebase/auth';
// // import { useNavigation } from '@react-navigation/native';
// import { router } from 'expo-router';

// function PhoneAuthScreen() {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [code, setCode] = useState('');
//   const [confirm, setConfirm] = useState(null);
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);



//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
//       setUser(user);
//       if (initializing) setInitializing(false);
//       if (user) {
//         // navigation.replace('WelcomeScreen'); // 👈 go to welcome on success

//         // router.replace('/Screens/Signup'); // 👈 go to chats on success
//         console.log('User authenticated:', user);
//         Alert.alert('Success', 'User authenticated successfully');
//       }
//     });

//     return unsubscribe;
//   }, []);

//   const handleSendCode = async () => {
//     if (!phoneNumber) {
//       Alert.alert('Please enter a phone number');
//       return;
//     }

//     try {
//       setLoading(true);
//       const confirmation = await signInWithPhoneNumber(getAuth(), phoneNumber);
//       setConfirm(confirmation);
//       setError(null);
//     } catch (err) {
//       console.log('OTP send error:', err);
//       setError('Failed to send OTP. Check the number or setup.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmCode = async () => {
//     try {
//       setLoading(true);
//       await confirm.confirm(code);
//       setError(null);
//     } catch (err) {
//       console.log('OTP verify error:', err);
//       setError('Invalid code. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (initializing) {
//     return (
//       <SafeAreaView style={styles.centered}>
//         <ActivityIndicator size="large" color="#000" />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {!confirm ? (
//         <>
//           <Text style={styles.title}>Enter Phone Number</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="+92XXXXXXXXXX"
//             keyboardType="phone-pad"
//             value={phoneNumber}
//             onChangeText={setPhoneNumber}
//           />
//           <Button title="Send OTP" onPress={handleSendCode} disabled={loading} />
//           {error && <Text style={styles.error}>{error}</Text>}
//         </>
//       ) : (
//         <>
//           <Text style={styles.title}>Enter OTP Code</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter 6-digit code"
//             keyboardType="number-pad"
//             value={code}
//             onChangeText={setCode}
//           />
//           <Button title="Verify OTP" onPress={confirmCode} disabled={loading || code.length < 6} />
//           {error && <Text style={styles.error}>{error}</Text>}
//         </>
//       )}
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
//   title: {
//     fontSize: 22,
//     marginBottom: 15,
//     fontWeight: '600',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 20,
//     fontSize: 16,
//   },
//   error: {
//     color: 'red',
//     marginTop: 10,
//   },
// });

// export default PhoneAuthScreen;


// import { Redirect } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { connectSocket, getSocket } from '@/utils/socket';
// import * as Notifications from "expo-notifications";
// import { Alert } from 'react-native';

// export default function Index() {
//   const [redirectTo, setRedirectTo] = useState(null);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const userId = await AsyncStorage.getItem('userId');
//         const userData = await AsyncStorage.getItem('userData');

//         if (token && userId && userData) {
//           setRedirectTo('/(tabs)/chats');
//         } else {
//           setRedirectTo('/Splash');
//         }
//       } catch (error) {
//         console.error('Error checking AsyncStorage', error);
//         setRedirectTo('/Splash');
//       }
//     };

//     checkAuth();
//   }, []);

//   if (!redirectTo) return null; // Optional: Show loading spinner here

//   return <Redirect href={redirectTo} />;
// }



import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import firebaseApp from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';

export default function Index() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // Runtime check: confirm whether native firebase app is initialized
  useEffect(() => {
    try {
      const appsAvailable = firebaseApp.apps ? firebaseApp.apps.length : undefined;
      console.log('Firebase native apps count:', appsAvailable);
      // if firebaseApp.app exists, log the default app name
      if (typeof firebaseApp.app === 'function') {
        try {
          const defaultName = firebaseApp.app().name;
          console.log('Default native firebase app name:', defaultName);
        } catch (e) {
          console.log('No default native firebase app available:', e.message);
        }
      }
    } catch (err) {
      console.warn('Error checking @react-native-firebase/app:', err.message || err);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const [token, userId, userData] = await Promise.all([
          AsyncStorage.getItem('userToken'),
          AsyncStorage.getItem('userId'),
          AsyncStorage.getItem('userData')
        ]);

        setRedirectTo(token && userId && userData ? '/(tabs)/chats' : '/Splash');
      } catch (error) {
        console.error('Error checking AsyncStorage', error);
        setRedirectTo('/Splash');
      }
    };

    checkAuth();
  }, []);

  if (!redirectTo) {
    return <ActivityIndicator size="large" />;
  }

  return <Redirect href={redirectTo} />;
}


// import {
//     View,
//     Text,
//     StyleSheet,
//     TextInput,
//     Dimensions,
//     ActivityIndicator,
//     KeyboardAvoidingView,
//     Platform,
//     TouchableWithoutFeedback,
//     Keyboard,
//     ScrollView,
//     TouchableOpacity,
//     Image,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { Ionicons } from "@expo/vector-icons";
// // import AuthButton from '../Components/AuthButton';
// import AuthButton from "./Components/AuthButton";
// import { globalStyles } from "@/Styles/globalStyles";
// import CustomButton from "./Components/CustomButton";
// import InputField from "./Components/InputFiled";
// import { Formik } from "formik";
// import * as yup from "yup";
// import { router } from "expo-router";
// import * as WebBrowser from 'expo-web-browser'
// import * as Google from 'expo-auth-session/providers/google';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Divider from "./Components/Divider";
// const { height, width } = Dimensions.get("window");


// //google Cloud Console WPSMTPMAIL project
// const webClientId = '940223357277-qgpv2dt56t4kh51kigc59cm3g40i0fa1.apps.googleusercontent.com';
// const androidClientId = '940223357277-crjr9od1m4kr91ir8vvo1d5ro54q684v.apps.googleusercontent.com';
// const iosClientId = '940223357277-crjr9od1m4kr91ir8vvo1d5ro54q684v.apps.googleusercontent.com';

// const loginSchema = yup.object({
//     phoneNumber: yup.string()
//         .test('phone-length', 'Phone number too short', (value) => {
//             // Remove country code for validation
//             const numberWithoutCode = value?.replace(/^\+971/, '') || '';
//             return numberWithoutCode.length >= 9;
//         })
//         .required("Phone number is required")

// });

// WebBrowser.maybeCompleteAuthSession();


// // const getUserProfile = async (token) => {
// //     if (!token) {
// //         console.error('No token provided');
// //         return null;
// //     }
// //     try {
// //         const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
// //             headers: {
// //                 Authorization: `Bearer ${token}`,
// //             },
// //         });

// //         if (!response.ok) {
// //             throw new Error('Failed to fetch user profile');
// //         }

// //         const userProfile = await response.json();
// //         console.log('User Profile:', userProfile);
// //         await AsyncStorage.setItem('userToken', token);
// //         await AsyncStorage.setItem('userData', JSON.stringify(userProfile));
// //         router.push({
// //             pathname: '/(tabs)/chats',
// //             params: userProfile,
// //         });

// //         return userProfile;
// //     } catch (error) {
// //         console.error('Error fetching user profile:', error);
// //         return null;
// //     }
// // }

// const getUserProfile = async (token) => {
//     try {
//         const response = await fetch('https://32b5245c5f10.ngrok-free.app/api/auth/google', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ token }),
//         });

//         if (!response.ok) {
//             throw new Error('Failed to login with Google');
//         }

//         const { token: appToken, user } = await response.json();

//         // Save your app's token and user in AsyncStorage
//         await AsyncStorage.setItem('userToken', appToken);
//         await AsyncStorage.setItem('userData', JSON.stringify(user));
//         await AsyncStorage.setItem('userId', user._id);
//         console.log('Google login successful. Token and user data saved.');
//         console.log('User Data:', user);
//         console.log('App Token:', appToken);

//         console.log("User ID:", user._id);
//         router.push({
//             pathname: '/(tabs)/chats',
//             params: user,
//         });
//     } catch (error) {
//         console.error('Google sign-in failed:', error);
//     }
// };


// const Login = () => {
//     const [isLoading, setIsLoading] = useState(false);
//     const config = {
//         webClientId,
//         iosClientId,
//         androidClientId,
//     }
//     const [request, response, promptAsync] = Google.useAuthRequest(config);

//     const handleToken = () => {
//         if (response?.type === 'success') {
//             const { authentication } = response;

//             const token = authentication?.accessToken;
//             console.log('Google Access Token:', token);
//             // router.push('/(tabs)/chats');
//             getUserProfile(token)


//         }
//     }


//     // This function will be called when the Google sign-in is successful

//     // const handleToken = () => {
//     //     if (response?.type === 'success') {
//     //         const { authentication } = response;

//     //         const token = authentication?.idToken; // ✅ This is what backend expects
//     //         console.log('Google ID Token:', token);

//     //         getUserProfile(token);
//     //     }
//     // };


//     useEffect(() => {
//         handleToken()
//     }, [response]);
//     const [isPasswordVisible, setPasswordVisible] = useState(false);

//     const handleSignIn = async (values) => {
//         setIsLoading(true);
//         if (values.phoneNumber) {
//             router.push({
//                 pathname: "/Screens/Login_2",
//                 params: {
//                     phoneNumber: values.phoneNumber,
//                 },
//             });
//         }
//         setIsLoading(false);
//     };


//     return (
//         <ScrollView style={globalStyles.container}>
//             <KeyboardAvoidingView
//                 style={globalStyles.container}
//                 behavior={Platform.OS === "ios" ? "padding" : "height"}
//                 keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -150} // Adjust offset if needed
//             >
//                 <Image source={require('../assets/images/small_logo.png')} style={[globalStyles.image, {


//                 }]} resizeMode='contain' />

//                 <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//                     <View >

//                         <Formik
//                             initialValues={{ phoneNumber: "" }}
//                             validationSchema={loginSchema}
//                             onSubmit={(values) => {
//                                 handleSignIn(values);
//                             }}
//                         >
//                             {({ values, handleChange, handleBlur, touched, errors, handleSubmit }) => (
//                                 <View>
//                                     <InputField
//                                         placeholder="Phone Number"
//                                         isPhone
//                                         value={values.phoneNumber}
//                                         onChangeText={handleChange("phoneNumber")}
//                                         onBlur={handleBlur("phoneNumber")}
//                                     />
//                                     {touched.phoneNumber && errors.phoneNumber && (
//                                         <Text style={[globalStyles.error, { marginLeft: width * 0.08, marginBottom: height * 0.02 }]}>{errors.phoneNumber}</Text>
//                                     )}


//                                     <View style={{ marginTop: height * 0.02 }} />
//                                     <CustomButton
//                                         title={
//                                             isLoading ? (
//                                                 <ActivityIndicator size="small" color="white" />
//                                             ) : (
//                                                 "Continue"
//                                             )
//                                         }
//                                         onPress={handleSubmit}
//                                         disabled={isLoading}
//                                     />
//                                 </View>
//                             )}
//                         </Formik>




//                     </View>
//                 </TouchableWithoutFeedback>



//                 <TouchableOpacity style={globalStyles.lower_cont}>

//                     <Divider />
//                     <Text style={{ marginHorizontal: width * 0.02, color: "#626856", fontSize: 14, fontWeight: "500" }}>
//                         or

//                     </Text>
//                     <Divider />
//                 </TouchableOpacity>


//                 <AuthButton
//                     image={require('../assets/images/google.png')}
//                     text="Continue with Google"
//                     onPress={() => promptAsync()}
//                 />


//                 {/* <AuthButton
//                     image={require('../../assets/images/apple.png')}
//                     text="Continue with Apple"
//                     onPress={() => console.log('Apple Pressed')}
//                     bgColor="#fff"
//                     textColor="#000"
//                     border={true}
//                     iconBg="transparent"
//                 /> */}

//                 <View style={{ marginTop: height * 0.18, alignContent: 'center', alignItems: 'center' }}>
//                     <Text style={globalStyles.subtitle}>
//                         Don't have an Account?
//                     </Text>

//                     <CustomButton title="Signup" extraSmall login onPress={() => router.push('/Screens/Signup')} />
//                 </View>


//             </KeyboardAvoidingView>




//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({


//     continueContainer: {
//         display: 'flex',
//         flexDirection: 'row',
//         // backgroundColor: 'lightblue',

//         width: width * 0.85,
//         marginHorizontal: width * 0.08,
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginTop: height * 0.03
//     },

//     signUpText: {
//         textAlign: "center",

//     },

//     icon: {
//         width: width * 0.12,
//         height: height * 0.06,
//         marginHorizontal: width * 0.04,
//     },
// });

// export default Login;