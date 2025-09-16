import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  ActivityIndicator, Dimensions
} from 'react-native';
import React, { useState } from 'react';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { router } from 'expo-router';
import { globalStyles } from '@/Styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { DatePickerModal } from 'react-native-paper-dates';
import CustomButton from '@/app/Components/CustomButton';
import { groupStyle } from '@/Styles/groupStyle';
import { useGroup } from '@/context/GroupContext';

const { width, height } = Dimensions.get('window');

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { groupData } = useGroup();
  const groupId = groupData.groupId;

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return alert('User not authenticated');

      const payload = { groupId, ...formData };
      const response = await axios.post(
        'https://32b5245c5f10.ngrok-free.app/api/home/createEvent',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        alert('Event Created Successfully!');
        router.back();
      } else {
        alert('Failed to create event.');
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
      <CustomHeader title="Create Event" onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={groupStyle.container}>
        {/* Title */}
        <View style={groupStyle.inputWrapper}>
          <Text style={groupStyle.label}>Title</Text>
          <TextInput
            placeholder="Enter Event Title"
            value={formData.title}
            onChangeText={(text) => handleChange('title', text)}
            style={groupStyle.input}
          />
        </View>

        {/* Description */}
        <View style={groupStyle.inputWrapper}>
          <Text style={groupStyle.label}>Description</Text>
          <TextInput
            placeholder="Enter Description"
            value={formData.description}
            onChangeText={(text) => handleChange('description', text)}
            style={[groupStyle.input, { height: 100, textAlignVertical: 'top' }]}
            multiline
          />
        </View>

        {/* Date Picker */}
        <View style={groupStyle.inputWrapper}>
          <Text style={groupStyle.label}>Event Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={groupStyle.dateInput}
          >
            <Text style={groupStyle.dateText}>
              {formData.date
                ? new Date(formData.date).toLocaleString()
                : 'Select Event Date & Time'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DatePickerModal
              locale="en"
              mode="single"
              visible={true}
              date={formData.date ? new Date(formData.date) : undefined}
              onDismiss={() => setShowDatePicker(false)}
              onConfirm={({ date }) => {
                if (date) {
                  handleChange('date', date.toISOString());
                }
                setShowDatePicker(false);
              }}
            />
          )}
        </View>

        {/* Submit Button */}
        <CustomButton
          title={isLoading ? <ActivityIndicator size="small" color="white" /> : 'Create Event'}
          onPress={onSubmit}
          disabled={isLoading}
          large={true}
        />
      </ScrollView>
    </View>
  );
};

export default CreateEvent;
