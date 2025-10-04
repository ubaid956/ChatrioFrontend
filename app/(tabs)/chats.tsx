import { View, Text, StyleSheet, Dimensions, ActivityIndicator, FlatList, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import HomeHeader from '../Components/HomeHeader'
import { globalStyles } from '@/Styles/globalStyles'
import { useNavigation, useRouter, useFocusEffect } from 'expo-router'
import MyTabs from '../Components/MyTabs';
import AudioMessage from '../Components/AudioMessage'
import MessageComponent from '../Components/MessagesComonent';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { connectSocket, getSocket } from '@/utils/socket';
import { usePushTokenRegistration } from '@/hooks/usePushTokenRegistration';

const { height, width } = Dimensions.get('window')

const Chats = () => {

  const { t } = useTranslation();
  const router = useRouter()
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-register push token when user is authenticated
  const { expoPushToken } = usePushTokenRegistration();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          setError('Authentication token not found.');
          return;
        }

        // Load current user data from AsyncStorage
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setCurrentUser(userData);
        }

        const response = await axios.get('https://chatrio-backend.onrender.com/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Sort by most recent message (fallback to createdAt if needed)
        const usersResponse = response.data.data || [];
        const sorted = [...usersResponse].sort((a, b) => {
          const aTime = a.lastPreviewAt ? new Date(a.lastPreviewAt).getTime() : 0;
          const bTime = b.lastPreviewAt ? new Date(b.lastPreviewAt).getTime() : 0;
          return bTime - aTime;
        });
        setUsers(sorted);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Refresh when screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const refresh = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          if (!token) return;

          // Reload current user data from AsyncStorage
          const userDataString = await AsyncStorage.getItem('userData');
          if (userDataString && isActive) {
            const userData = JSON.parse(userDataString);
            setCurrentUser(userData);
          }

          const response = await axios.get('https://chatrio-backend.onrender.com/api/auth/users', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!isActive) return;
          const usersResponse = response.data.data || [];
          const sorted = [...usersResponse].sort((a, b) => {
            const aTime = a.lastPreviewAt ? new Date(a.lastPreviewAt).getTime() : 0;
            const bTime = b.lastPreviewAt ? new Date(b.lastPreviewAt).getTime() : 0;
            return bTime - aTime;
          });
          setUsers(sorted);
        } catch { }
      };
      refresh();
      return () => { isActive = false };
    }, [])
  );

  // Realtime updates for last preview when a private message arrives
  useEffect(() => {
    const initSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;
        const socket = connectSocket(token);
        socket.off('privateMessage');
        socket.on('privateMessage', (msg) => {
          setUsers((prev) => {
            // Update the sender's row in the chat list
            const updated = prev.map(u => {
              if (u._id === (msg.sender?._id || msg.sender)) {
                const createdAt = msg.createdAt || new Date().toISOString();
                const timeStr = new Date(createdAt).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                });
                return {
                  ...u,
                  lastPreviewMessage: msg.text || (msg.audio ? '🎵 Audio message' : u.lastPreviewMessage),
                  lastPreviewTime: timeStr,
                  lastPreviewAt: createdAt,
                };
              }
              return u;
            });
            // Resort by recency
            return updated.sort((a, b) => {
              const aTime = a.lastPreviewAt ? new Date(a.lastPreviewAt).getTime() : 0;
              const bTime = b.lastPreviewAt ? new Date(b.lastPreviewAt).getTime() : 0;
              return bTime - aTime;
            });
          });
        });
      } catch (e) {
        console.warn('Socket init failed', e);
      }
    };
    initSocket();

    return () => {
      try {
        const socket = getSocket();
        socket?.off('privateMessage');
      } catch { }
    };
  }, []);



  const handleMessagePress = (user) => {
    router.push({
      pathname: '/Screens/ChatMessage',
      params: { userId: user._id },
    });
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
      <HomeHeader
        title={t('home')}
        titleKey={'Home'}
        avatar={currentUser?.pic}
      />


      <View style={{ paddingHorizontal: width * 0.04 }}>


        <View style={globalStyles.textCon}>
          <Text style={globalStyles.homeText}>{t('app_name')}</Text>
          <Text>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </Text>
        </View>


        {/* <MyTabs /> */}

        <Text style={globalStyles.homeText}>
          {t('recent_conversations')}
        </Text>



      </View>

      {users.length === 0 ? (
        <Text style={styles.emptyText}>{t('no_recent_chats')}</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <MessageComponent
              name={item.name}
              message={item.lastPreviewMessage}
              time={item.lastPreviewTime}
              unreadCount={0}
              profileImage={item.pic}
              onPress={() => handleMessagePress(item)}
            />
          )}
        />
      )}



    </SafeAreaView>
  )
}

export default Chats

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',

    fontSize: 16,
    color: '#888',

    marginTop: height * 0.3,
    // backgroundColor: 'red',

  },
})