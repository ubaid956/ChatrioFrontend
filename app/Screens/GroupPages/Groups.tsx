import { View, Text, SafeAreaView, Dimensions, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { globalStyles } from '@/Styles/globalStyles';
import { useGroup } from '@/context/GroupContext';
import MessageComponent from '@/app/Components/MessagesComonent';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const { groupData, setGroupData } = useGroup();

    useEffect(() => {
        fetchGroups();
    }, [groupData.groupType]);

    const fetchGroups = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('userToken');
        try {
            const response = await axios.get(`https://37prw4st-5000.asse.devtunnels.ms/api/groups/${groupData.groupType}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={globalStyles.activityContainer}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <CustomHeader
                title={`${groupData.groupType} Groups`}
                onBackPress={() => router.back()}
            />
            <View style={{ paddingHorizontal: width * 0.04, marginTop: height * 0.02 }}>
                <Text style={[globalStyles.title, { fontSize: 16 }]}>
                    Manage your {groupData.groupType.toLowerCase()} teams and projects
                </Text>
            </View>

            {groups.length === 0 ? (
                <Text style={styles.emptyText}>No {groupData.groupType.toLowerCase()} groups found</Text>
            ) : (
                <FlatList
                    data={groups}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingHorizontal: width * 0.04, marginTop: height * 0.02 }}
                    renderItem={({ item }) => (
                        <MessageComponent
                            name={item.name}
                            message={`${item.members.length} members`}
                            time={new Date(item.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                            unreadCount={0}
                            profileImage={item.pic}
                            onPress={() => {
                                setGroupData({
                                    groupId: item._id,
                                    groupName: item.name,
                                    groupType: item.type,
                                });
                                router.push('./groupchats');
                            }}
                        />
                    )}
                />
            )}
        </SafeAreaView>
    );
};

export default Groups;

const styles = StyleSheet.create({
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: height * 0.3,
    },
});
