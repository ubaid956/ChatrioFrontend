import {
    View, Text, ScrollView, TextInput, TouchableOpacity,
    ActivityIndicator, Image, Dimensions
} from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { router } from 'expo-router';
import { globalStyles } from '@/Styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { DatePickerModal } from 'react-native-paper-dates';
import CustomButton from '@/app/Components/CustomButton';
import { Menu, Button } from 'react-native-paper';
import { groupStyle } from '@/Styles/groupStyle';
import { MaterialIcons } from '@expo/vector-icons';
import { useGroup } from '@/context/GroupContext';

const { width, height } = Dimensions.get('window');

const CreateChore = () => {
    const [formData, setFormData] = useState({
        task: '',
        assignedTo: '',
        dueDate: '',
    });
    const { groupData } = useGroup();
    const groupId = groupData.groupId;

    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);


    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedUserName, setSelectedUserName] = useState('Select person');

    // Fetch Users for Group
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const response = await axios.get(
                    `https://32b5245c5f10.ngrok-free.app/api/groups/${groupId}/users`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUsers(response.data.users);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, [groupId]);

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async () => {
        try {
            setIsLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            const sender = await AsyncStorage.getItem('userId');
            if (!token || !sender) return alert('User not authenticated');

            const payload = { groupId, ...formData, sender };
            const response = await axios.post(
                'https://32b5245c5f10.ngrok-free.app/api/home/createChore',
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200 || response.status === 201) {
                alert('Chore Created Successfully!');
                router.back();
            } else {
                alert('Failed to create chore.');
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
            <CustomHeader title="Create Chore" onBackPress={() => router.back()} />
            <ScrollView contentContainerStyle={groupStyle.container}>
                <View style={groupStyle.inputWrapper}>
                    <Text style={groupStyle.label}>Task</Text>
                    <TextInput
                        placeholder="Enter Task"
                        value={formData.task}
                        onChangeText={(text) => handleChange('task', text)}
                        style={groupStyle.input}
                    />
                </View>

                <View style={{ width: width * 0.9, marginBottom: height * 0.02, alignSelf: 'center' }}>
                    <Text style={groupStyle.label}>Assign To</Text>

                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <TouchableOpacity
                                onPress={() => setMenuVisible(true)}
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
                                <Text style={{ fontSize: 16, color: selectedUserName === 'Select person' ? '#999' : '#000' }}>
                                    {selectedUserName}
                                </Text>
                                <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                            </TouchableOpacity>
                        }
                        style={{ width: width * 0.9, alignSelf: 'center', marginTop: height * 0.06 }}
                    >
                        {users.map((user) => (
                            <Menu.Item
                                key={user._id}
                                onPress={() => {
                                    handleChange('assignedTo', user._id);
                                    setSelectedUserName(user.name);
                                    setMenuVisible(false);
                                }}
                                title={user.name}
                                leadingIcon={() => (
                                    <Image
                                        source={{ uri: user.pic }}
                                        style={{ width: 30, height: 30, borderRadius: 15 }}
                                    />
                                )}
                            />
                        ))}
                    </Menu>
                </View>

                <View style={groupStyle.inputWrapper}>
                    <Text style={groupStyle.label}>Due Date</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={groupStyle.dateInput}
                    >
                        <Text style={groupStyle.dateText}>
                            {formData.dueDate
                                ? new Date(formData.dueDate).toLocaleDateString()
                                : 'Select Due Date'}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DatePickerModal
                            locale="en"
                            mode="single"
                            visible={true}
                            date={formData.dueDate ? new Date(formData.dueDate) : undefined}
                            onDismiss={() => setShowDatePicker(false)}
                            onConfirm={({ date }) => {
                                if (date) {
                                    handleChange('dueDate', date.toISOString());
                                }
                                setShowDatePicker(false);
                            }}
                        />
                    )}
                </View>

                <CustomButton
                    title={isLoading ? <ActivityIndicator size="small" color="white" /> : 'Create Chore'}
                    onPress={onSubmit}
                    disabled={isLoading}
                    large={true}
                />
            </ScrollView>
        </View>
    );
};

export default CreateChore;
