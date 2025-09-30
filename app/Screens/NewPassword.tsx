import { View, Text, Dimensions, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import LoginHeader from '../Components/LoginHeader'
import InputField from '../Components/InputFiled'
import { globalStyles } from '@/Styles/globalStyles'
import CustomButton from '../Components/CustomButton'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useLocalSearchParams } from 'expo-router';

import { useRouter } from 'expo-router';

const { height, width } = Dimensions.get('window')

const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password too short')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Confirm Password is required'),
})

const NewPassword = () => {
  const route = useRouter()
  // const userId = route.params?.userId
  const { userId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);


  const handleReset = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://37prw4st-5000.asse.devtunnels.ms/api/auth/users/updatePassword', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          newPassword: values.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        Alert.alert('Reset Failed', data.message || 'Unable to reset password')
        return
      }

      Alert.alert('Success', 'Password Reset Successful!')
      resetForm()
      route.push('/Screens/Login')
      // Optionally navigate to login screen here
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.')
      console.error('Password reset error:', error)
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <View>
      <LoginHeader
        title="New Password"
        subtitle="Create a new password for your account"
        onPress={() => route.back()}
      />

      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={PasswordSchema}
        onSubmit={handleReset}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          dirty,
        }) => (
          <View>
            <InputField
              placeholder="Password"
              icon="lock-closed"
              isPassword
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
            />
            {touched.password && errors.password && (
              <Text style={[globalStyles.error, { marginLeft: width * 0.08 }]}>{errors.password}</Text>
            )}

            <InputField
              placeholder="Confirm Password"
              icon="lock-closed"
              isPassword
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={[globalStyles.error, { marginLeft: width * 0.08 }]}>{errors.confirmPassword}</Text>
            )}

            <Text style={[globalStyles.msgText, { marginBottom: height * 0.03, marginTop: height * 0.01, marginLeft: width * 0.08 }]}>
              Password must be at least 6 characters with letters and numbers
            </Text>

            {/* <CustomButton
              title="Reset Password"
              onPress={handleSubmit}
              disabled={!(isValid && dirty)} // 🔒 Button disabled unless valid & touched
            />
             */}
            <CustomButton
              title={
                isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  "Reset Password"
                )
              }
              onPress={handleSubmit}
              disabled={isLoading}
            />
          </View>
        )}
      </Formik>
    </View>
  )
}

export default NewPassword
