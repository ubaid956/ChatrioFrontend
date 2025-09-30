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


const { width, height } = Dimensions.get('window');
const CreateItinerary = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
    });

    const [destinations, setDestinations] = useState([{ name: '', date: '', activities: [''] }]);
    const [transportation, setTransportation] = useState([{ mode: '', company: '', from: '', to: '', departureTime: '', arrivalTime: '' }]);
    const [accommodations, setAccommodations] = useState([{ name: '', address: '', checkIn: '', checkOut: '', bookingRef: '' }]);

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { groupData } = useGroup();
    const groupId = groupData.groupId;

    const handleChange = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

    const updateNestedField = (index, field, value, stateSetter, state) => {
        const updated = [...state];
        updated[index][field] = value;
        stateSetter(updated);
    };

    const onSubmit = async () => {
        try {
            setIsLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            if (!token) return alert('User not authenticated');

            const payload = {
                ...formData,
                times: {
                    startDate: formData.startDate,
                    endDate: formData.endDate
                },
                destinations,
                transportation,
                accommodations,
                groupId
            };

            const response = await axios.post(
                'https://37prw4st-5000.asse.devtunnels.ms/api/travel/itinerary',
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200 || response.status === 201) {
                Alert.alert('Success', 'Itinerary Created Successfully!');
                router.back();
            } else {
                alert('Failed to create itinerary.');
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
            <CustomHeader title="Create Itinerary" onBackPress={() => router.back()} />
            <ScrollView contentContainerStyle={groupStyle.container}>

                {/* Title & Description */}
                <View style={groupStyle.inputWrapper}>
                    <Text style={groupStyle.label}>Title</Text>
                    <TextInput placeholder="Title" placeholderTextColor="#999"
                        style={groupStyle.input} value={formData.title} onChangeText={(t) => handleChange('title', t)} />
                </View>
                <View style={groupStyle.inputWrapper}>
                    <Text style={groupStyle.label}>Description</Text>
                    <TextInput placeholder="Description" placeholderTextColor="#999"
                        multiline style={[groupStyle.input, { height: height * 0.09 }]} value={formData.description} onChangeText={(t) => handleChange('description', t)} />
                </View>
                {/* Start Date */}
                <View style={groupStyle.inputWrapper}>
                    <Text style={groupStyle.label}>Start Date</Text>
                    <TouchableOpacity onPress={() => setShowStartPicker(true)} style={groupStyle.dateInput}>
                        <Text>{formData.startDate ? new Date(formData.startDate).toLocaleString() : 'Select Start Date'}</Text>
                    </TouchableOpacity>

                    {showStartPicker && (
                        <DatePickerModal visible mode="single" locale="en" onDismiss={() => setShowStartPicker(false)} onConfirm={({ date }) => { handleChange('startDate', date.toISOString()); setShowStartPicker(false); }} />
                    )}
                </View>

                {/* End Date */}

                <View style={groupStyle.inputWrapper}>
                    <Text style={groupStyle.label}>End Date</Text>
                    <TouchableOpacity onPress={() => setShowEndPicker(true)} style={groupStyle.dateInput}>
                        <Text>{formData.endDate ? new Date(formData.endDate).toLocaleString() : 'Select End Date'}</Text>
                    </TouchableOpacity>
                    {showEndPicker && (
                        <DatePickerModal visible mode="single" locale="en" onDismiss={() => setShowEndPicker(false)} onConfirm={({ date }) => { handleChange('endDate', date.toISOString()); setShowEndPicker(false); }} />
                    )}
                </View>

                {/* Destinations */}
                <View style={groupStyle.inputWrapper}>
                    <Text style={groupStyle.label}>Destinations</Text>
                    {destinations.map((dest, idx) => (

                        <View key={idx}>
                            <TextInput placeholder="City Name" placeholderTextColor="#999"
                                value={dest.name} onChangeText={(t) => updateNestedField(idx, 'name', t, setDestinations, destinations)} style={[groupStyle.input, { marginBottom: height * 0.01 }]} />
                            <TextInput placeholder="Date (YYYY-MM-DD)" placeholderTextColor="#999"
                                value={dest.date} onChangeText={(t) => updateNestedField(idx, 'date', t, setDestinations, destinations)} style={[groupStyle.input, { marginBottom: height * 0.01 }]} />
                            <TextInput placeholder="Activities (comma separated)" placeholderTextColor="#999"
                                value={dest.activities.join(', ')} onChangeText={(t) => updateNestedField(idx, 'activities', t.split(','), setDestinations, destinations)} style={[groupStyle.input, { marginBottom: height * 0.01 }]} />
                        </View>
                    ))}
                    <TouchableOpacity onPress={() => setDestinations([...destinations, { name: '', date: '', activities: [''] }])}><Text>Add Destination</Text></TouchableOpacity>

                </View>

                {/* Transportation */}
                <View style={groupStyle.inputWrapper}>
                    <Text style={groupStyle.label}>Transportation</Text>
                    {transportation.map((tran, idx) => (
                        <View key={idx}>
                            {['mode', 'company', 'from', 'to', 'departureTime', 'arrivalTime'].map((f) => (
                                <TextInput key={f} placeholderTextColor="#999"
                                    placeholder={f} value={tran[f]} onChangeText={(t) => updateNestedField(idx, f, t, setTransportation, transportation)} style={[groupStyle.input, { marginBottom: height * 0.01 }]} />
                            ))}
                        </View>
                    ))}
                    <TouchableOpacity onPress={() => setTransportation([...transportation, { mode: '', company: '', from: '', to: '', departureTime: '', arrivalTime: '' }])}><Text>Add Transportation</Text></TouchableOpacity>
                </View>
                {/* Accommodations */}

                <View style={groupStyle.inputWrapper}>
                    <Text style={groupStyle.label}>Accommodations</Text>
                    {accommodations.map((acc, idx) => (
                        <View key={idx}>
                            {['name', 'address', 'checkIn', 'checkOut', 'bookingRef'].map((f) => (
                                <TextInput key={f} placeholderTextColor="#999"
                                     placeholder={f} value={acc[f]} onChangeText={(t) => updateNestedField(idx, f, t, setAccommodations, accommodations)} style={[groupStyle.input, { marginBottom: height * 0.01 }]} />
                            ))}
                        </View>
                    ))}
                    <TouchableOpacity onPress={() => setAccommodations([...accommodations, { name: '', address: '', checkIn: '', checkOut: '', bookingRef: '' }])}><Text>Add Accommodation</Text></TouchableOpacity>
                </View>
                <CustomButton title={isLoading ? <ActivityIndicator color="white" /> : 'Create Itinerary'} onPress={onSubmit} disabled={isLoading} large />
            </ScrollView>
        </View>
    );
};

export default CreateItinerary;
