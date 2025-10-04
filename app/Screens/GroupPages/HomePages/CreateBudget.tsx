import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import React, { useState } from 'react';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { router } from 'expo-router';
import { globalStyles } from '@/Styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomButton from '@/app/Components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { groupStyle } from '@/Styles/groupStyle';
import { useGroup } from '@/context/GroupContext';


const { width, height } = Dimensions.get('window');
const CreateBudget = () => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'income', // default selected
    category: '',
  });
  const { groupData } = useGroup();
  const groupId = groupData.groupId;
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const sender = await AsyncStorage.getItem('userId');

      if (!token || !sender) return alert('User not authenticated');

      const payload = {
        groupId,
        ...formData,
        amount: parseFloat(formData.amount),
        sender,
      };

      const response = await axios.post(
        'https://chatrio-backend.onrender.com/api/home/addbudget',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert('Budget Created Successfully!');
        router.back();
      } else {
        alert('Failed to create budget.');
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      alert('Error while submitting.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <CustomHeader title="Create Budget" onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={groupStyle.container}>
        <View style={groupStyle.inputWrapper}>
          <Text style={groupStyle.label}>Title</Text>
          <TextInput
            placeholder="Enter Budget Title"
            placeholderTextColor="#999"

            value={formData.title}
            onChangeText={(text) => handleChange('title', text)}
            style={groupStyle.input}
          />
        </View>

        <View style={groupStyle.inputWrapper}>
          <Text style={groupStyle.label}>Amount</Text>
          <TextInput
            placeholder="Enter Amount"
            placeholderTextColor="#999"

            keyboardType="numeric"
            value={formData.amount}
            onChangeText={(text) => handleChange('amount', text)}
            style={groupStyle.input}
          />
        </View>

        <View >
          <Text style={groupStyle.label}>Type</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width * 0.9, marginBottom: height * 0.02 }}>
            <TouchableOpacity
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  flex: 1,
                  marginRight: 10,
                  backgroundColor: formData.type === 'income' ? '#e6f9ee' : 'transparent',
                  borderColor: formData.type === 'income' ? 'green' : '#ccc',
                },
              ]}
              onPress={() => handleChange('type', 'income')}
            >
              <Ionicons
                name="arrow-up"
                size={16}
                color={formData.type === 'income' ? 'green' : '#666'}
              />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 16,
                  color: formData.type === 'income' ? 'green' : '#333',
                  fontWeight: formData.type === 'income' ? '600' : 'normal',
                }}
              >
                Income
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  flex: 1,
                  backgroundColor: formData.type === 'expense' ? '#fdecea' : 'transparent',
                  borderColor: formData.type === 'expense' ? 'red' : '#ccc',
                },
              ]}
              onPress={() => handleChange('type', 'expense')}
            >
              <Ionicons
                name="arrow-down"
                size={16}
                color={formData.type === 'expense' ? 'red' : '#666'}
              />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 16,
                  color: formData.type === 'expense' ? 'red' : '#333',
                  fontWeight: formData.type === 'expense' ? '600' : 'normal',
                }}
              >
                Expense
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={groupStyle.inputWrapper}>
          <Text style={groupStyle.label}>Category</Text>
          <TextInput
            placeholder="Enter Category e.g. Rent, Food"
            placeholderTextColor="#999"

            value={formData.category}
            onChangeText={(text) => handleChange('category', text)}
            style={groupStyle.input}
          />
        </View>

        <CustomButton
          title={isLoading ? <ActivityIndicator size="small" color="white" /> : 'Create Budget'}
          onPress={onSubmit}
          disabled={isLoading}
          large={true}
        />
      </ScrollView>
    </View>
  );
};

export default CreateBudget;
