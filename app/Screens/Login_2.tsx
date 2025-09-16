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

    async function registerForPushNotificationsAsync() {
        let token;

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notifications!');
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log('Expo Push Token:', token);
        } else {
            alert('Must use physical device for push notifications');
        }
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }


        return token;
    }


    const handleSignIn = async (values: any) => {
        setIsLoading(true);
        try {
            // Login request
            const response = await axios.post(
                `https://32b5245c5f10.ngrok-free.app/api/auth/login`,
                { phone: phoneNumber, password: values.password }
            );

            const { token, ...user } = response.data;

            // Save locally
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userData', JSON.stringify(user));
            await AsyncStorage.setItem('userId', user._id);

            // Ask for push notification permission
            let pushToken;
            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;

                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus === 'granted') {
                    pushToken = (await Notifications.getExpoPushTokenAsync()).data;
                    console.log("Expo Push Token:", pushToken);

                    // Save push token to backend
                    const updateRes = await axios.post(
                        `https://32b5245c5f10.ngrok-free.app/api/auth/updatePushToken`,
                        { userId: user._id, pushToken },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log("Push token saved:", updateRes.data);

                    // Fetch updated user to confirm pushToken
                    const updatedUserRes = await axios.get(
                        `https://32b5245c5f10.ngrok-free.app/api/auth/users/${user._id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    const savedPushToken = updatedUserRes.data.data.user.pushToken;
                    console.log("Updated user:", updatedUserRes.data);
                    Alert.alert("Login Successful", `Push token saved: ${savedPushToken}`);
                } else {
                    Alert.alert("Push Notifications permission denied!");
                }
            } else {
                Alert.alert("Must use a physical device for push notifications");
            }

            // Navigate
            router.push("/(tabs)/chats");

        } catch (error: any) {
            Alert.alert(
                "Login Failed",
                error.response?.data?.message || "Invalid phone or password",
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

                <View>

                    <Text style={[globalStyles.title, { fontSize: 24, textAlign: 'center' }]}>
                        Welcome
                    </Text>
                    <Text style={[globalStyles.title, { marginTop: height * 0.02, marginBottom: height * 0.01, fontSize: 14, textAlign: 'center' }]}>
                        {phoneNumber ? ` ${phoneNumber}` : ""}
                    </Text>
                </View>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View >

                        <Formik
                            initialValues={{ email: "" }}
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
