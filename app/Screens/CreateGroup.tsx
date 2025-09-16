// screens/CreateGroup.js
import {
    View,
    Text,
    Dimensions,
    ActivityIndicator,
    FlatList,
    TextInput,
    Alert,
    TouchableOpacity,
    SafeAreaView,
    Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import HomeHeader from '../Components/HomeHeader';
import { globalStyles } from '@/Styles/globalStyles';
import MessageComponent from '../Components/MessagesComonent';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { height, width } = Dimensions.get('window');

const CreateGroup = () => {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectionMode, setSelectionMode] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupType, setNewGroupType] = useState('Work');
    const [currentUser, setCurrentUser] = useState(null);

    /* ────────────────────────────────────
       FETCH USERS  (runs once)
    ──────────────────────────────────────*/
    useEffect(() => {
        (async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) throw new Error('Authentication token not found');

                // Load current user data from AsyncStorage
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    setCurrentUser(userData);
                }

                const res = await axios.get(
                    'https://32b5245c5f10.ngrok-free.app/api/auth/users',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUsers(res.data.data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);


    const handleCreateGroup = async () => {
        if (!groupName || !groupType || selectedUsers.length === 0) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('Not authenticated');


            await axios.post(
                'https://32b5245c5f10.ngrok-free.app/api/groups',
                { name: groupName, users: selectedUsers, type: groupType },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert('Success', 'Group created successfully');
            router.back();
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to create group');
        }
    };

    const toggleUserSelection = id => {
        setSelectionMode(true);
        setSelectedUsers(prev => {
            const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
            if (next.length === 0) setSelectionMode(false);
            return next;
        });
    };


    const handleLongPress = (userId) => {
        console.log('User long pressed:', userId);

    };



    if (loading) {
        return (
            <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>{error}</Text>
            </View>
        );
    }
    const handleCreateGroupFromModal = async () => {
        if (!newGroupName) {
            Alert.alert('Error', 'Please enter a group name');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('Not authenticated');

            const payload = {
                name: newGroupName,
                type: newGroupType,
                members: selectedUsers
            };

            await axios.post(
                'https://32b5245c5f10.ngrok-free.app/api/groups',
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert('Success', 'Group created successfully');

            // Reset states
            setShowGroupModal(false);
            setNewGroupName('');
            setNewGroupType('Work');
            setSelectedUsers([]);
            setSelectionMode(false);

            // Navigate back which will trigger the Groups screen to refresh
            router.back();
        } catch (err) {
            console.error('Group creation error:', err);
            Alert.alert('Error', err.response?.data?.message || 'Failed to create group');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>


            <HomeHeader
                title={selectionMode ? `${selectedUsers.length}` : 'Create Group'}
                createGroup
                avatar={currentUser?.pic}
                rightAction={() => {
                    if (selectionMode && selectedUsers.length > 0) {
                        setShowGroupModal(true);
                    }
                }}
                rightText={selectionMode && selectedUsers.length > 0 ? 'New Group' : 'New Group'}
            />

            <Modal
                visible={showGroupModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowGroupModal(false)}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <View style={{
                        width: width * 0.8,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        padding: 20
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 15
                        }}>Create New Group</Text>

                        {/* Group Name Input */}
                        <Text style={{ marginBottom: 5 }}>Group Name</Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 5,
                                padding: 10,
                                marginBottom: 15
                            }}
                            value={newGroupName}
                            onChangeText={setNewGroupName}
                            placeholder="Enter group name"
                        />

                        {/* Group Type Picker */}
                        <Text style={{ marginBottom: 5 }}>Group Type</Text>
                        <View style={{
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 5,
                            marginBottom: 20
                        }}>
                            <Picker
                                selectedValue={newGroupType}
                                onValueChange={(itemValue) => setNewGroupType(itemValue)}
                            >
                                <Picker.Item label="Home" value="Home" />
                                <Picker.Item label="Work" value="Work" />
                                <Picker.Item label="School" value="School" />
                                <Picker.Item label="Travel" value="Travel" />
                            </Picker>
                        </View>


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#ccc',
                                    padding: 10,
                                    borderRadius: 5,
                                    width: '30%'
                                }}
                                onPress={() => setShowGroupModal(false)}
                            >
                                <Text style={{ textAlign: 'center' }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#694df0',
                                    padding: 10,
                                    borderRadius: 5,
                                    width: '65%'
                                }}
                                onPress={handleCreateGroupFromModal}
                            >
                                <Text style={{
                                    textAlign: 'center',
                                    color: 'white'
                                }}>Create Group</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <View
                style={{
                    paddingHorizontal: width * 0.04,
                    marginTop: height * 0.02,
                    marginBottom: height * 0.01,
                }}
            >
                <Text>Select Users</Text>
            </View>

            <FlatList
                data={users}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <MessageComponent
                        name={item.name}
                        message={item.lastPreviewMessage}
                        time={item.lastPreviewTime}
                        unreadCount={0}
                        profileImage={item.pic}
                        isSelected={selectedUsers.includes(item._id)}
                        onPress={() => {
                            if (selectionMode) {
                                toggleUserSelection(item._id);
                            } else {
                                // Handle normal press if needed
                                console.log('Normal press');
                            }
                        }}
                        onLongPress={() => {
                            toggleUserSelection(item._id);
                        }}
                    />
                )}
            />



        </SafeAreaView>
    );
};

export default CreateGroup;
