import {
    View,
    Text,
    Dimensions,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import AuthButton from '../Components/AuthButton';
import { globalStyles } from "@/Styles/globalStyles";
import CustomButton from "../Components/CustomButton";
import InputField from "../Components/InputFiled";
import { Formik } from "formik";
import * as yup from "yup";
import { router } from "expo-router";
import * as WebBrowser from 'expo-web-browser'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Divider from "../Components/Divider";
import auth from '@react-native-firebase/auth';
const { height, width } = Dimensions.get("window");

//google Cloud Console WPSMTPMAIL project
const loginSchema = yup.object({
    phoneNumber: yup.string()
        .test('phone-length', 'Phone number too short', (value) => {
            // Remove country code for validation
            const numberWithoutCode = value?.replace(/^\+971/, '') || '';
            return numberWithoutCode.length >= 9;
        })
        .required("Phone number is required")

});

WebBrowser.maybeCompleteAuthSession();




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
const getUserProfile = async (token) => {
    try {
        console.log('Starting Google login process...');
        const response = await fetch('https://32b5245c5f10.ngrok-free.app/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        // Try to parse JSON, but handle non-JSON responses gracefully
        let bodyText = null;
        let bodyJson = null;
        try {
            bodyText = await response.text();
            bodyJson = bodyText ? JSON.parse(bodyText) : null;
        } catch (parseErr) {
            console.warn('Failed to parse JSON from /api/auth/google response:', parseErr.message);
            console.log('Raw response text:', bodyText);
        }

        if (!response.ok) {
            const message = (bodyJson && bodyJson.message) || bodyText || `Request failed with status ${response.status}`;
            throw new Error(message);
        }

        const { token: appToken, user } = bodyJson || {};

        // Save your app's token and user in AsyncStorage
        await AsyncStorage.setItem('userToken', appToken);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        await AsyncStorage.setItem('userId', user._id);
        console.log('Google login successful. Token and user data saved.');
        console.log('User Data:', user);
        console.log('App Token:', appToken);

        // --- PUSH TOKEN LOGIC START ---
        try {
            const Notifications = await import('expo-notifications');
            const Device = await import('expo-device');
            let pushToken = null;
            if (Device.isDevice && user?._id) {
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
                        body: JSON.stringify({ userId: user._id, pushToken })
                    });
                }
            }
        } catch (pushErr) {
            console.warn('Failed to update push token after Google login:', pushErr);
        }
        // --- PUSH TOKEN LOGIC END ---

        console.log("User ID:", user._id);

        // Use replace instead of push for Android compatibility
        console.log('Navigating to chats...');
        router.replace('/(tabs)/chats');
    } catch (error) {
        console.error('Google sign-in failed:', error);
        Alert.alert('Login Failed', error.message || 'Failed to sign in with Google. Please try again.');
    }
};


const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "250145305468-nc9215v70cs4v9viehtl2t0nmvh94885.apps.googleusercontent.com"
        });
    }, []);

    // Handle Google Sign-In using native GoogleSignin
    const handleGoogleSignIn = async () => {
        try {
            // Ensure play services are available (Android)
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Sign in and get user info and idToken
            await GoogleSignin.signIn();
            // getTokens returns idToken and accessToken (if available)
            const tokens = await GoogleSignin.getTokens();
            const { idToken, accessToken } = tokens || {};

            // Use Firebase to create credential and sign in
            if (idToken || accessToken) {
                const credential = auth.GoogleAuthProvider.credential(idToken, accessToken);
                await auth().signInWithCredential(credential);
            }

            // Prefer sending accessToken to backend (your server expects access token)
            const tokenToSend = accessToken || idToken;

            if (tokenToSend) {
                console.log('Google sign-in successful, token:', tokenToSend);
                getUserProfile(tokenToSend);
            } else {
                console.warn('No token returned from Google Signin');
                Alert.alert('Google Sign-in Error', 'No token received from Google.');
            }
        } catch (error) {
            console.error('Google Signin Error:', error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Play Services Not Available', 'Google Play Services is not available or outdated.');
            } else {
                Alert.alert('Google Sign-in Error', error.message || 'Failed to sign in with Google.');
            }
        }
    };




    const handleSignIn = async (values) => {
        setIsLoading(true);
        try {
            if (!values.phoneNumber) {
                Alert.alert('Error', 'Please enter a phone number');
                return;
            }

            let formattedPhone = values.phoneNumber.trim();
            if (!formattedPhone.startsWith('+')) {
                if (formattedPhone.startsWith('0')) {
                    formattedPhone = formattedPhone.substring(1);
                }
                formattedPhone = `+92${formattedPhone}`;
            }

            const confirmation = await auth().signInWithPhoneNumber(formattedPhone);

            // Store confirmation in AsyncStorage for verification
            await AsyncStorage.setItem('firebaseConfirmation', JSON.stringify({
                verificationId: confirmation.verificationId,
                phoneNumber: formattedPhone
            }));

            router.push({
                pathname: "/Screens/Verification",
                params: {
                    phoneNumber: formattedPhone,
                    next: 'login',
                },
            });
        } catch (err) {
            console.log('OTP send error:', err);
            let errorMessage = 'Failed to send OTP. Please check the phone number.';
            if (err.code === 'auth/invalid-phone-number') {
                errorMessage = 'Invalid phone number format';
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = 'Too many requests. Please try again later.';
            }
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <ScrollView style={globalStyles.container}>
            <KeyboardAvoidingView
                style={globalStyles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -150} // Adjust offset if needed
            >
                <Image source={require('../../assets/images/small_logo.png')} style={[globalStyles.image, {


                }]} resizeMode='contain' />

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View >

                        <Formik
                            initialValues={{ phoneNumber: "" }}
                            validationSchema={loginSchema}
                            onSubmit={(values) => {
                                handleSignIn(values);
                            }}
                        >
                            {({ values, handleChange, handleBlur, touched, errors, handleSubmit }) => (
                                <View>
                                    <InputField
                                        placeholder="Phone Number"
                                        isPhone
                                        value={values.phoneNumber}
                                        onChangeText={handleChange("phoneNumber")}
                                        onBlur={handleBlur("phoneNumber")}
                                    />
                                    {touched.phoneNumber && errors.phoneNumber && (
                                        <Text style={[globalStyles.error, { marginLeft: width * 0.08, marginBottom: height * 0.02 }]}>{errors.phoneNumber}</Text>
                                    )}


                                    <View style={{ marginTop: height * 0.02 }} />
                                    <CustomButton
                                        title={
                                            isLoading ? (
                                                <ActivityIndicator size="small" color="white" />
                                            ) : (
                                                "Continue"
                                            )
                                        }
                                        onPress={handleSubmit}
                                        disabled={isLoading}
                                    />
                                </View>
                            )}
                        </Formik>




                    </View>
                </TouchableWithoutFeedback>



                <TouchableOpacity style={globalStyles.lower_cont}>

                    <Divider />
                    <Text style={{ marginHorizontal: width * 0.02, color: "#626856", fontSize: 14, fontWeight: "500" }}>
                        or

                    </Text>
                    <Divider />
                </TouchableOpacity>


                <AuthButton
                    image={require('../../assets/images/google.png')}
                    text="Continue with Google"
                    onPress={() => {
                        console.log('Google sign-in button pressed');
                        handleGoogleSignIn();
                    }}
                />


                <View style={{ marginTop: height * 0.18, alignContent: 'center', alignItems: 'center' }}>
                    <Text style={globalStyles.subtitle}>
                        Don’t have an Account?
                    </Text>

                    <CustomButton title="Signup" extraSmall login onPress={() => router.push('/Screens/Signup')} />
                </View>


            </KeyboardAvoidingView>

        </ScrollView>
    );
};

export default Login;


