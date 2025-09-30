import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import LoginHeader from '../Components/LoginHeader';
import CustomButton from '../Components/CustomButton';
import InputField from '../Components/InputFiled';
import { globalStyles } from '@/Styles/globalStyles';
import axios from 'axios';
import { useRouter } from 'expo-router';

const { height, width } = Dimensions.get('window');

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleSendCode = async () => {
        setIsLoading(true);
        if (!email) {
            setErrorMessage('Please enter your email.');
            return;
        }


        setErrorMessage('');
        try {
            const res = await axios.post('https://37prw4st-5000.asse.devtunnels.ms/api/auth/users/forgot', { email });

            if (res.status === 200) {
                router.push({
                    pathname: '/Screens/Verification',
                    params: { email: email },
                },
                );
            }
        } catch (error: any) {
            const message =
                error?.response?.data?.message || 'Something went wrong. Please try again.';
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }

        // router.push('Screens/Verification')
    };

    return (
        <View style={globalStyles.container}>
            <LoginHeader
                title="Forgot Password"
                subtitle="Enter your email or phone number and we'll send you a code to reset your password"
                onPress={() => router.back()}
            />

            <InputField
                placeholder="Email"
                icon="mail"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setErrorMessage('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {errorMessage !== '' && (
                <Text style={{ color: 'red', marginTop: 4, marginLeft: width * 0.09, fontSize: 12, }}>
                    {errorMessage}
                </Text>
            )}

            <View style={{ marginTop: height * 0.03 }}>
                <CustomButton
                    title={
                        isLoading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            "Send Code"
                        )
                    }
                    onPress={handleSendCode}
                    disabled={isLoading}
                />
            </View>
        </View>
    );
};

export default ForgotPassword;
