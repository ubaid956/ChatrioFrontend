import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Dimensions,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    TouchableOpacity,
    Image, Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AuthButton from '../Components/AuthButton';
import { globalStyles } from "@/Styles/globalStyles";
import CustomButton from "../Components/CustomButton";
import InputField from "../Components/InputFiled";
import { Formik } from "formik";
import * as yup from "yup";
import { router, useLocalSearchParams } from "expo-router";
import { useRoute } from '@react-navigation/native'
import Divider from "../Components/Divider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import axios from 'axios'
import Constants from 'expo-constants';

const { height, width } = Dimensions.get("window");

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});
const loginSchema = yup.object({

    password: yup
        .string()
        .min(6, "Password must be at least 6 characters long")
        .required("Password is required"),
});

const Login_2 = () => {
    const { phoneNumber } = useLocalSearchParams();

    const route = useRoute()

    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    // Use shared helper to register for push notifications (ensures projectId is passed)
    async function registerForPushNotificationsAsyncLocal() {
        try {
            const { registerForPushNotificationsAsync } = await import('@/utils/registerForPushNotificationsAsync');
            return await registerForPushNotificationsAsync();
        } catch (err) {
            console.warn('Failed to register for push notifications:', err);
            return null;
        }
    }


    const handleSignIn = async (values: any) => {
        setIsLoading(true);
        try {
            // Login request
            console.log('=== FRONTEND LOGIN ATTEMPT ===');
            console.log('Phone from params:', phoneNumber);
            console.log('Password entered:', values.password ? '[PRESENT]' : '[MISSING]');
            console.log('API endpoint:', 'https://chatrio-backend.onrender.com/api/auth/login');

            // Remove + prefix to match backend format (971525554980)
            const phoneWithoutPlus = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber;
            const requestData = { phone: phoneWithoutPlus, password: values.password };
            console.log('Request data being sent:', requestData);

            const response = await axios.post(
                `https://chatrio-backend.onrender.com/api/auth/login`,
                requestData
            );

            console.log('✅ Login successful! Response:', response.data);

            const { token, ...user } = response.data;

            // Save locally
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userData', JSON.stringify(user));
            await AsyncStorage.setItem('userId', user._id);

            // Ask for push notification permission with Android enhancements
            let pushToken;
            if (Device.isDevice) {
                console.log('📱 Setting up push notifications for:', Platform.OS);

                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                console.log('Current notification permission status:', existingStatus);

                if (existingStatus !== 'granted') {
                    console.log('Requesting notification permissions...');
                    const { status } = await Notifications.requestPermissionsAsync({
                        ios: {
                            allowAlert: true,
                            allowBadge: true,
                            allowSound: true,
                            allowAnnouncements: true,
                        },
                        android: {
                            allowAlert: true,
                            allowBadge: true,
                            allowSound: true,
                        },
                    });
                    finalStatus = status;
                    console.log('New notification permission status:', finalStatus);
                }

                if (finalStatus === 'granted') {
                    console.log('✅ Getting Expo push token...');
                    pushToken = await registerForPushNotificationsAsyncLocal();
                    console.log(`📱 Expo Push Token (${Platform.OS}):`, pushToken);

                    // Test notification for Android
                    // if (Platform.OS === 'android') {
                    //     console.log('🧪 Sending test Android notification...');
                    //     await Notifications.scheduleNotificationAsync({
                    //         content: {
                    //             title: "Chatrio Login Success",
                    //             body: "Welcome! Push notifications are working on Android 🎉",
                    //             sound: 'default',
                    //             data: { test: true },
                    //         },
                    //         trigger: { seconds: 2 },
                    //     });
                    // }

                    // Save push token to backend
                    const updateRes = await axios.post(
                        `https://chatrio-backend.onrender.com/api/auth/updatePushToken`,
                        { userId: user._id, pushToken },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log("Push token saved:", updateRes.data);

                    // Fetch updated user to confirm pushToken
                    const updatedUserRes = await axios.get(
                        `https://chatrio-backend.onrender.com/api/auth/users/${user._id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    const savedPushToken = updatedUserRes.data.data.user.pushToken;
                    console.log("Updated user:", updatedUserRes.data);

                    // Debug notification setup with Android-specific checks
                    const debugRes = await axios.post(
                        `https://chatrio-backend.onrender.com/api/auth/debug-notifications`,
                        { userId: user._id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log("🔍 Debug info:", debugRes.data);

                    // Android-specific notification permission check
                    // if (Platform.OS === 'android') {
                    //     const permissionStatus = await Notifications.getPermissionsAsync();
                    //     console.log("📱 Android notification permissions:", permissionStatus);

                    //     // Check if notification channels are created
                    //     try {
                    //         const channels = await Notifications.getNotificationChannelsAsync();
                    //         console.log("📱 Android notification channels:", channels);

                    //         // Test local notification to verify channel setup
                    //         await Notifications.scheduleNotificationAsync({
                    //             content: {
                    //                 title: "Test Notification 📱",
                    //                 body: "This is a test to verify Android notifications are working",
                    //                 data: { test: true },
                    //             },
                    //             trigger: null, // Show immediately
                    //         });
                    //         console.log("✅ Test notification scheduled");

                    //         // Test with chat-messages channel specifically
                    //         await Notifications.scheduleNotificationAsync({
                    //             content: {
                    //                 title: "Chat Test 📱",
                    //                 body: "Testing chat-messages channel specifically",
                    //                 data: { test: true, channel: 'chat-messages' },
                    //             },
                    //             trigger: null,
                    //         });
                    //         console.log("✅ Chat channel test notification scheduled");
                    //     } catch (error) {
                    //         console.log("⚠️ Could not get notification channels or schedule test:", error);
                    //     }
                    // }

                    // Show success with debug info
                    // Alert.alert(
                    //     "Login Successful",
                    //     `Platform: ${Platform.OS}\nPush token: ${savedPushToken.slice(0, 20)}...\nToken valid: ${debugRes.data.debug?.tokenValid ? 'Yes' : 'No'}`,
                    //     [
                    //         {
                    //             text: "Test Android Notification",
                    //             onPress: async () => {
                    //                 try {
                    //                     console.log("🧪 Testing Android notification...");

                    //                     // First test a local notification
                    //                     if (Platform.OS === 'android') {
                    //                         await Notifications.scheduleNotificationAsync({
                    //                             content: {
                    //                                 title: "Local Test 🧪",
                    //                                 body: "This is a local Android notification test",
                    //                                 data: { test: true },
                    //                             },
                    //                             trigger: null, // Show immediately
                    //                         });
                    //                         console.log("✅ Local notification sent");
                    //                     }

                    //                     // Then test remote notification
                    //                     const testRes = await axios.post(
                    //                         `https://chatrio-backend.onrender.com/api/auth/test-notification`,
                    //                         { userId: user._id, platform: Platform.OS },
                    //                         { headers: { Authorization: `Bearer ${token}` } }
                    //                     );
                    //                     console.log("🚀 Remote notification result:", testRes.data);
                    //                     Alert.alert("Tests Sent", "Check your device for both local and remote notifications!");
                    //                 } catch (err) {
                    //                     console.error("❌ Test notification error:", err);
                    //                     Alert.alert("Test Failed", "Could not send test notifications");
                    //                 }
                    //             }
                    //         },
                    //         { text: "OK" }
                    //     ]
                    // );
                } else {
                    Alert.alert("Push Notifications permission denied!");
                }
            } else {
                Alert.alert("Must use a physical device for push notifications");
            }

            // Navigate
            router.push("/(tabs)/chats");

        } catch (error: any) {
            console.log('❌ LOGIN ERROR ===');
            console.log('Error object:', error);
            console.log('Error response:', error.response);
            console.log('Error message:', error.message);

            if (error.response) {
                console.log('Server responded with:', {
                    status: error.response.status,
                    data: error.response.data,
                    statusText: error.response.statusText
                });
            }

            Alert.alert(
                "Login Failed",
                error.response?.data?.message || error.message || "Invalid phone or password",
                [{ text: "OK" }]
            );
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
                            initialValues={{ password: "" }}
                            validationSchema={loginSchema}
                            onSubmit={(values) => {
                                handleSignIn(values);
                            }}
                        >
                            {(props) => (
                                <View >
                                    <InputField
                                        placeholder="Password"
                                        icon="lock-closed"
                                        isPassword
                                        value={props.values.password}
                                        onChangeText={props.handleChange("password")}
                                        onBlur={props.handleBlur("password")}
                                    />

                                    <Text style={[globalStyles.error, { marginLeft: width * 0.08, marginBottom: height * 0.01 }]}>
                                        {props.touched.password && props.errors.password}
                                    </Text>

                                    <CustomButton
                                        title={
                                            isLoading ? (
                                                <ActivityIndicator size="small" color="white" />
                                            ) : (
                                                "Login"
                                            )
                                        }
                                        onPress={props.handleSubmit}
                                        disabled={isLoading}
                                    />
                                    {/* <CustomButton title="Login" onPress={props.handleSubmit} /> */}
                                    <TouchableOpacity onPress={() => router.push('/Screens/ForgotPassword')}>
                                        <Text style={globalStyles.forgotText}>Forgot Password?</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>



                    </View>
                </TouchableWithoutFeedback>







            </KeyboardAvoidingView>




        </ScrollView>
    );
};

const styles = StyleSheet.create({


    continueContainer: {
        display: 'flex',
        flexDirection: 'row',
        // backgroundColor: 'lightblue',

        width: width * 0.85,
        marginHorizontal: width * 0.08,
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: height * 0.03
    },

    signUpText: {
        textAlign: "center",

    },

    icon: {
        width: width * 0.12,
        height: height * 0.06,
        marginHorizontal: width * 0.04,
    },
});

export default Login_2;
