import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { router } from 'expo-router';
import { globalStyles } from '@/Styles/globalStyles';
import { groupStyle } from '@/Styles/groupStyle';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomButton from '@/app/Components/CustomButton';
import { useGroup } from '@/context/GroupContext';

const { width } = Dimensions.get('window');

const CreateShoppingList = () => {
  const [shoppingItems, setShoppingItems] = useState([{ name: '', quantity: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const { groupData } = useGroup();
  const groupId = groupData.groupId;

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const sender = await AsyncStorage.getItem('userId');

      const validItems = shoppingItems.filter(
        (item) => item.name.trim() && item.quantity.trim()
      );

      if (validItems.length === 0) {
        alert('Please add at least one valid item.');
        return;
      }

      const response = await axios.post(
        'https://32b5245c5f10.ngrok-free.app/api/home/shoppingList',
        {
          groupId,
          items: validItems,
          sender,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert('Shopping List Created Successfully!');
        router.back();
      } else {
        alert('Failed to create shopping list.');
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
      <CustomHeader title="Create Shopping List" onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={groupStyle.container}>
        {shoppingItems.map((item, index) => (
          <View key={index} style={{ marginBottom: 16 }}>
            <Text style={groupStyle.label}>Item Name</Text>
            <TextInput
              placeholder="Enter Item Name"
              value={item.name}
              onChangeText={(text) => {
                const updatedItems = [...shoppingItems];
                updatedItems[index].name = text;
                setShoppingItems(updatedItems);
              }}
              style={groupStyle.input}
            />
            <View style={{ height: 10 }} />
            <Text style={groupStyle.label}>Quantity</Text>
            <TextInput
              placeholder="Enter Quantity e.g. 2KG, 3L"
              value={item.quantity}
              onChangeText={(text) => {
                const updatedItems = [...shoppingItems];
                updatedItems[index].quantity = text;
                setShoppingItems(updatedItems);
              }}
              style={groupStyle.input}
            />
            {shoppingItems.length > 1 && (
              <TouchableOpacity
                onPress={() => {
                  const updatedItems = shoppingItems.filter((_, idx) => idx !== index);
                  setShoppingItems(updatedItems);
                }}
                style={{ marginTop: 8 }}
              >
                <Text style={{ color: 'red' }}>Remove Item</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity
          onPress={() => setShoppingItems((prev) => [...prev, { name: '', quantity: '' }])}
          style={[groupStyle.addOptionButton, { marginBottom: 20 }]}
        >
          <Ionicons name="add" size={20} style={groupStyle.addOptionIcon} />
          <Text style={groupStyle.addOptionText}>Add Item</Text>
        </TouchableOpacity>

        <CustomButton
          title={isLoading ? <ActivityIndicator size="small" color="white" /> : 'Create Shopping List'}
          onPress={onSubmit}
          disabled={isLoading}
          large={true}
        />
      </ScrollView>
    </View>
  );
};

export default CreateShoppingList;

// const styles = StyleSheet.create({
//   container: { padding: 16, paddingBottom: 30, alignItems: 'center' },

//   label: {
//     marginBottom: 4,
//     fontWeight: '600',
//     fontSize: 16,
//     alignSelf: 'flex-start',
//   },

//   input: {
//     backgroundColor: '#f0f0f0',
//     padding: 12,
//     borderRadius: 8,
//     fontSize: 16,
//     width: width * 0.9,
//     alignSelf: 'center',
//   },

//   addOptionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'center',
//     padding: 12,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 8,
//     marginTop: 8,
//     width: width * 0.9,
//     justifyContent: 'center',
//   },

//   addOptionIcon: {
//     marginRight: 8,
//     color: '#4F46E5',
//   },

//   addOptionText: {
//     color: '#4F46E5',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });
