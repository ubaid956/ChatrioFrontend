import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, Dimensions
} from 'react-native';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { router } from 'expo-router';
import { globalStyles } from '@/Styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { DatePickerModal } from 'react-native-paper-dates';
import CustomButton from '@/app/Components/CustomButton';
import { groupStyle } from '@/Styles/groupStyle';
import { useGroup } from '@/context/GroupContext';


const { height, width } = Dimensions.get('window')
const CreateChecklist = () => {
  const [destination, setDestination] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [items, setItems] = useState([{ name: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const { groupData } = useGroup();
  const groupId = groupData.groupId;

  const updateItem = (index, value) => {
    const newItems = [...items];
    newItems[index].name = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: '' }]);
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return alert('User not authenticated');

      const payload = {
        groupId,
        destination,
        travelDate: {
          from: fromDate,
          to: toDate,
        },
        items: items.filter(item => item.name.trim() !== '')
      };

      const response = await axios.post(
        'https://32b5245c5f10.ngrok-free.app/api/travel/checklist',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Checklist Created Successfully!');
        router.back();
      } else {
        alert('Failed to create checklist.');
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert('Error while submitting.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <CustomHeader title="Create Checklist" onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={groupStyle.container}>

        {/* Destination */}
        <View style={groupStyle.inputWrapper}>
          <Text style={groupStyle.label}>Destination</Text>
          <TextInput
            placeholder="Destination"
            style={groupStyle.input}
            value={destination}
            onChangeText={setDestination}
          />
        </View>

        {/* From Date */}
        <View style={groupStyle.inputWrapper}>
          <Text style={groupStyle.label}>From </Text>
          <TouchableOpacity onPress={() => setShowFromPicker(true)} style={groupStyle.dateInput}>
            <Text>{fromDate ? new Date(fromDate).toLocaleDateString() : 'Select From Date'}</Text>
          </TouchableOpacity>
          {showFromPicker && (
            <DatePickerModal
              mode="single"
              visible
              locale="en"
              onDismiss={() => setShowFromPicker(false)}
              onConfirm={({ date }) => {
                setFromDate(date.toISOString());
                setShowFromPicker(false);
              }}
            />
          )}
        </View>

        {/* To Date */}

        <View style={groupStyle.inputWrapper}>
          <Text style={groupStyle.label}>To</Text>
          <TouchableOpacity onPress={() => setShowToPicker(true)} style={groupStyle.dateInput}>
            <Text>{toDate ? new Date(toDate).toLocaleDateString() : 'Select To Date'}</Text>
          </TouchableOpacity>
          {showToPicker && (
            <DatePickerModal
              mode="single"
              visible
              locale="en"
              onDismiss={() => setShowToPicker(false)}
              onConfirm={({ date }) => {
                setToDate(date.toISOString());
                setShowToPicker(false);
              }}
            />
          )}
        </View>
        {/* Checklist Items */}
        <View style={groupStyle.inputWrapper}>

          <Text style={groupStyle.label}>Checklist Items</Text>

          {items.map((item, index) => (
            <TextInput
              key={index}
              placeholder={`Item ${index + 1}`}
              style={[groupStyle.input, { marginBottom: height * 0.01 }]}
              value={item.name}
              onChangeText={(text) => updateItem(index, text)}
            />
          ))}

          <TouchableOpacity onPress={addItem}>
            <Text style={{ color: 'blue', marginTop: 10 }}>+ Add More Items</Text>
          </TouchableOpacity>
        </View>
        <CustomButton
          title={isLoading ? <ActivityIndicator color="white" /> : 'Create Checklist'}
          onPress={onSubmit}
          disabled={isLoading}
          large
        />
      </ScrollView>
    </View>
  );
};

export default CreateChecklist;
