import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import CustomButton from '@/app/Components/CustomButton';
import { globalStyles } from '@/Styles/globalStyles';
import { groupStyle } from '@/Styles/groupStyle';
import { useGroup } from '@/context/GroupContext';
const { width, height } = Dimensions.get('window');

const CreateQuiz = () => {
  const { groupData } = useGroup();
  const groupId = groupData.groupId;
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    topic: '',
    category: '',
    numberOfQuestions: '',
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    try {
      if (!formData.topic || !formData.category || !formData.numberOfQuestions) {
        alert('Please fill all fields');
        return;
      }

      setIsLoading(true);

      const token = await AsyncStorage.getItem('userToken');
      const sender = await AsyncStorage.getItem('userId');

      if (!token || !sender) {
        alert('User not authenticated');
        return;
      }

      const payload = {
        groupId,
        sender,
        ...formData,
        numberOfQuestions: parseInt(formData.numberOfQuestions),
      };

      const res = await axios.post(
        'https://chatrio-backend.onrender.com/api/school/quiz',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        alert('Quiz Generated Successfully!');
        router.back();
      } else {
        alert('Failed to generate quiz.');
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      alert('Error generating quiz.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <CustomHeader title="Create AI Quiz" onBackPress={() => router.back()} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={groupStyle.container}>
          <View style={groupStyle.inputWrapper}>
            <Text style={groupStyle.label}>Quiz Topic</Text>
            <TextInput
              placeholder="Enter quiz topic e.g. JavaScript"
              placeholderTextColor="#999"

              value={formData.topic}
              onChangeText={(text) => handleChange('topic', text)}
              style={groupStyle.input}
            />
          </View>

          <View style={groupStyle.inputWrapper}>
            <Text style={groupStyle.label}>Category</Text>
            <TextInput
              placeholder="Enter category e.g. Web, Science"
              value={formData.category}
              placeholderTextColor="#999"

              onChangeText={(text) => handleChange('category', text)}
              style={groupStyle.input}
            />
          </View>

          <View style={groupStyle.inputWrapper}>
            <Text style={groupStyle.label}>Number of Questions</Text>
            <TextInput
              placeholder="Enter number e.g. 5"
              keyboardType="numeric"
              placeholderTextColor="#999"

              value={formData.numberOfQuestions}
              onChangeText={(text) => handleChange('numberOfQuestions', text)}
              style={groupStyle.input}
            />
          </View>

          <View style={{ marginTop: height * 0.03 }}>
            <CustomButton
              title={
                isLoading ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={{ marginLeft: 10, color: '#fff' }}>
                      Generating...
                    </Text>
                  </View>
                ) : (
                  'Generate Quiz'
                )
              }
              onPress={onSubmit}
              disabled={isLoading}
              large={true}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    </View>
  );
};

export default CreateQuiz;
