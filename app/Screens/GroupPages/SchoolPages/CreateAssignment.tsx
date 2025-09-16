import {
    View,
    Text,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Dimensions, TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import CustomButton from '@/app/Components/CustomButton';
import LoadingModal from '@/app/Components/Group_Components/LoadingModal';
import { globalStyles } from '@/Styles/globalStyles';
import { groupStyle } from '@/Styles/groupStyle';
import { useGroup } from '@/context/GroupContext';
import { DatePickerModal } from 'react-native-paper-dates';

const { height } = Dimensions.get('window');

const CreateAssignment = () => {
    const { groupData } = useGroup();
    const groupId = groupData.groupId;
    const [isLoading, setIsLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);


    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
    });


    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async () => {
        try {
            if (!formData.title || !formData.description) {
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
            };

            const res = await axios.post(
                'https://32b5245c5f10.ngrok-free.app/api/school/assignment', // adjust if needed
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (res.status === 200 || res.status === 201) {
                alert('Assignment Created Successfully!');
                router.back();
            } else {
                alert('Failed to create assignment.');
            }
        } catch (error: any) {
            console.error(error.response?.data || error.message);
            alert('Error creating assignment.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={globalStyles.container}>
            <CustomHeader title="Create Assignment" onBackPress={() => router.back()} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={groupStyle.container}>
                    <View style={groupStyle.inputWrapper}>
                        <Text style={groupStyle.label}>Title</Text>
                        <TextInput
                            placeholder="e.g. MERN Stack App"
                            value={formData.title}
                            onChangeText={(text) => handleChange('title', text)}
                            style={groupStyle.input}
                        />
                    </View>

                    <View style={groupStyle.inputWrapper}>
                        <Text style={groupStyle.label}>Description</Text>
                        <TextInput
                            placeholder="e.g. Use AI to create MERN Stack App"
                            value={formData.description}
                            onChangeText={(text) => handleChange('description', text)}
                            style={[groupStyle.input, { height: 100, textAlignVertical: 'top' }]}
                            multiline
                            numberOfLines={4}
                        />
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


                    <View style={{ marginTop: height * 0.03 }}>
                        <CustomButton
                            title={isLoading ? 'Submitting...' : 'Create Assignment'}
                            onPress={onSubmit}
                            disabled={isLoading}
                            large
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>


        </View>
    );
};

export default CreateAssignment;
