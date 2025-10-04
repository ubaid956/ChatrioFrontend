import { globalStyles } from "@/Styles/globalStyles";
import { Formik } from "formik";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ActivityIndicator,
    Alert
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from "yup";
import CustomButton from "../Components/CustomButton";
import InputField from "../Components/InputFiled";
import { useRouter } from 'expo-router';
import { useTranslation } from "react-i18next";
import auth from '@react-native-firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const SignUpScreen = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // ✅ Schema with translated messages
    const SignupSchema = Yup.object().shape({
        fullName: Yup.string().required(t("full_name_required")),
        email: Yup.string().email(t("invalid_email")).required(t("email_required")),
        phoneNumber: Yup.string()
            .test('phone-length', t("phone_too_short"), (value) => {
                const numberWithoutCode = value?.replace(/^\+972/, '') || '';
                return numberWithoutCode.length >= 9;
            })
            .required(t("phone_required")),
        password: Yup.string()
            .min(6, t("password_too_short"))
            .required(t("password_required")),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], t("passwords_do_not_match"))
            .required(t("confirm_password_required")),
    });

    const handleFormSubmit = async (values, { resetForm }) => {
        setIsLoading(true);
        try {
            if (!values.phoneNumber) {
                Alert.alert(t('error'), t('phone_required'));
                return;
            }

            let formattedPhone = values.phoneNumber.trim();
            if (!formattedPhone.startsWith('+')) {
                if (formattedPhone.startsWith('0')) {
                    formattedPhone = formattedPhone.substring(1);
                }
                formattedPhone = `+971${formattedPhone}`;
            }

            const confirmation = await auth().signInWithPhoneNumber(formattedPhone);

            // Store confirmation in AsyncStorage for verification
            await AsyncStorage.setItem('firebaseConfirmation', JSON.stringify({
                verificationId: confirmation.verificationId,
                phoneNumber: formattedPhone
            }));

            router.push({
                pathname: '/Screens/Verification',
                params: {
                    phoneNumber: formattedPhone,
                    next: 'signup',
                    fullName: values.fullName,
                    email: values.email,
                    password: values.password,
                },
            });
        } catch (error) {
            console.error(error);
            Alert.alert(t('error'), t('something_went_wrong'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <View style={globalStyles.container}>
                    <View>
                        <Image
                            source={require('../../assets/images/small_logo.png')}
                            style={[globalStyles.image]}
                            resizeMode='contain'
                        />
                    </View>

                    <Formik
                        initialValues={{
                            fullName: "",
                            email: "",
                            phoneNumber: "",
                            password: "",
                            confirmPassword: "",
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={handleFormSubmit}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                        }) => (
                            <KeyboardAwareScrollView
                                enableOnAndroid={true}
                                extraHeight={Platform.OS === 'android' ? 100 : 0}
                                contentContainerStyle={{ paddingHorizontal: 20 }}
                            >
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text
                                        style={[
                                            globalStyles.title,
                                            { alignSelf: 'flex-start', marginLeft: width * 0.03, marginBottom: height * 0.02 }
                                        ]}
                                    >
                                        {t("create_account")}
                                    </Text>

                                    <InputField
                                        placeholder={t("full_name")}
                                        icon="person"
                                        value={values.fullName}
                                        onChangeText={handleChange("fullName")}
                                        onBlur={handleBlur("fullName")}
                                    />
                                    {touched.fullName && errors.fullName && (
                                        <Text style={globalStyles.error}>{errors.fullName}</Text>
                                    )}

                                    <InputField
                                        placeholder={t("email")}
                                        icon="mail"
                                        value={values.email}
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                    />
                                    {touched.email && errors.email && (
                                        <Text style={globalStyles.error}>{errors.email}</Text>
                                    )}

                                    <InputField
                                        placeholder={t("phone_number")}
                                        isPhone
                                        value={values.phoneNumber}
                                        onChangeText={handleChange("phoneNumber")}
                                        onBlur={handleBlur("phoneNumber")}
                                    />
                                    {touched.phoneNumber && errors.phoneNumber && (
                                        <Text style={globalStyles.error}>{errors.phoneNumber}</Text>
                                    )}

                                    <InputField
                                        placeholder={t("password")}
                                        icon="lock-closed"
                                        isPassword
                                        value={values.password}
                                        onChangeText={handleChange("password")}
                                        onBlur={handleBlur("password")}
                                    />
                                    {touched.password && errors.password && (
                                        <Text style={globalStyles.error}>{errors.password}</Text>
                                    )}
                                    <Text style={globalStyles.msgText}>
                                        {t("password_rules")}
                                    </Text>

                                    <InputField
                                        placeholder={t("confirm_password")}
                                        icon="lock-closed"
                                        isPassword
                                        value={values.confirmPassword}
                                        onChangeText={handleChange("confirmPassword")}
                                        onBlur={handleBlur("confirmPassword")}
                                    />
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <Text style={globalStyles.error}>{errors.confirmPassword}</Text>
                                    )}

                                    <View style={{ marginVertical: height * 0.02 }}>
                                        <CustomButton
                                            title={
                                                isLoading ? (
                                                    <ActivityIndicator size="small" color="white" />
                                                ) : (
                                                    t("continue")
                                                )
                                            }
                                            onPress={handleSubmit}
                                            disabled={isLoading}
                                        />
                                    </View>

                                    <View style={{ alignItems: "center", marginBottom: height * 0.2 }}>
                                        <TouchableOpacity onPress={() => router.back()}>
                                            <Text>
                                                {t("already_have_account")}{" "}
                                                <Text style={globalStyles.forgotText}>{t("login")}</Text>
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </KeyboardAwareScrollView>
                        )}
                    </Formik>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default SignUpScreen;
