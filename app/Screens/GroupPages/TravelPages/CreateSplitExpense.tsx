import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  ActivityIndicator, Image, Alert, Dimensions
} from 'react-native';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { router } from 'expo-router';
import { globalStyles } from '@/Styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Menu } from 'react-native-paper';
import CustomButton from '@/app/Components/CustomButton';
import { groupStyle } from '@/Styles/groupStyle';
import { MaterialIcons } from '@expo/vector-icons';
import { useGroup } from '@/context/GroupContext';

const { width, height } = Dimensions.get('window');

const CreateSplitExpense = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [sharedWith, setSharedWith] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0 });

  const touchableRef = useRef(null);

  const { groupData } = useGroup();
  const groupId = groupData.groupId;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const res = await axios.get(
          `https://32b5245c5f10.ngrok-free.app/api/groups/${groupId}/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(res.data.users);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [groupId]);

  const toggleUser = (userId) => {
    setSharedWith((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return alert('User not authenticated');

      const payload = {
        groupId,
        title,
        amount: parseFloat(amount),
        sharedWith
      };

      const response = await axios.post(
        'https://32b5245c5f10.ngrok-free.app/api/travel/splitepense',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Split expense created!');
        router.back();
      } else {
        alert('Failed to create split expense.');
      }
    } catch (err) {
      console.error(err);
      alert('Error while submitting.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <CustomHeader title="Split Expense" onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={groupStyle.container}>
        <View style={groupStyle.inputWrapper}>
          <Text style={groupStyle.label}>Title</Text>
          <TextInput
            placeholder="Enter Expense Title"
            value={title}
            onChangeText={setTitle}
            style={groupStyle.input}
          />
        </View>

        <View style={groupStyle.inputWrapper}>
          <Text style={groupStyle.label}>Amount</Text>
          <TextInput
            placeholder="Enter Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={groupStyle.input}
          />
        </View>

        <View style={{ width: width * 0.9, marginBottom: height * 0.02, alignSelf: 'center' }}>
          <Text style={groupStyle.label}>Split With</Text>

          <TouchableOpacity
            ref={touchableRef}
            onPress={() => {
              touchableRef.current?.measure((fx, fy, w, h, px, py) => {
                setAnchorPos({ x: px, y: py + h });
                setMenuVisible(true);
              });
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f0f0f0',
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 14,
              width: width * 0.9,
            }}
          >
            <Text style={{ fontSize: 16, color: '#000' }}>Select People</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
          </TouchableOpacity>

          {menuVisible && (
            <View style={{ position: 'absolute', top: anchorPos.y, left: anchorPos.x, zIndex: 10 }}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={{ x: anchorPos.x, y: anchorPos.y }}
                style={{ width: width * 0.9 }}
              >
                {users.map((user) => (
                  <Menu.Item
                    key={user._id}
                    onPress={() => toggleUser(user._id)}
                    title={user.name}
                    leadingIcon={() => (
                      <Image
                        source={{ uri: user.pic }}
                        style={{ width: 30, height: 30, borderRadius: 15 }}
                      />
                    )}
                    trailingIcon={() =>
                      sharedWith.includes(user._id) ? (
                        <MaterialIcons name="check" size={20} color="green" />
                      ) : null
                    }
                  />
                ))}
              </Menu>
            </View>
          )}
        </View>

        <CustomButton
          title={isLoading ? <ActivityIndicator color="white" /> : 'Split Now'}
          onPress={onSubmit}
          disabled={isLoading}
          large
        />
      </ScrollView>
    </View>
  );
};

export default CreateSplitExpense;