import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import {
  Alert,
  SafeAreaView,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AudioMessage from '../Components/AudioMessage';
import MessageHeader from '../Components/MessageHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { connectSocket, getSocket } from '@/utils/socket';
import { globalStyles } from '@/Styles/globalStyles';

const { height } = Dimensions.get('window');

const ChatMessage = () => {
  const { userId, groupId } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const inputRef = useRef();

  const [input, setInput] = useState('');
  const [recipient, setRecipient] = useState({
    name: 'Loading...',
    lastActive: new Date(),
    pic: '',
  });
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingWaveform, setRecordingWaveform] = useState([]);
  const recordingRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const [showRecordingUI, setShowRecordingUI] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setCurrentUserId(storedUserId);
      } catch (error) {
        console.error('Error getting current user ID:', error);
      }
    };

    getCurrentUserId();
  }, []);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        return;
      }
      const response = await axios.get(`https://37prw4st-5000.asse.devtunnels.ms/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = response.data.data.user;
      const messages = response.data.data.messages;
      setRecipient({
        name: user.name,
        lastActive: user.lastActive || new Date(),
        pic: user.pic || 'https://randomuser.me/api/portraits/women/44.jpg',
      });
      const formattedMessages = messages.map((msg, index) => {
        const isSentByMe = msg.isSentByMe || false;
        const messageTime = msg.time || 'Invalid Time';
        const uniqueId = msg._id || `${Date.now()}-${index}-${Math.random()}`;
        if (msg.audio && msg.audio.url) {
          return {
            id: uniqueId,
            audio: {
              url: msg.audio.url,
              duration: msg.audio.duration || null,
              mimeType: msg.audio.mimeType || 'audio/mpeg',
            },
            type: isSentByMe ? 'sent' : 'received',
            time: messageTime,
            duration: msg.audio.duration ? `${Math.floor(msg.audio.duration)}s` : '0s'
          };
        }
        if (msg.text && msg.text.trim() !== '') {
          return {
            id: uniqueId,
            text: msg.text,
            type: isSentByMe ? 'sent' : 'received',
            time: messageTime
          };
        }
        return null;
      }).filter(Boolean);
      setMessages(formattedMessages);

      // Auto-scroll to bottom when messages are loaded
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error fetching chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch data when we have the current user ID
  useEffect(() => {
    if (currentUserId) {
      fetchData();
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, [userId, currentUserId]);

  // Refresh chat when refreshTrigger changes (after message sent)
  useEffect(() => {
    if (refreshTrigger > 0) {
      const refreshChat = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          if (!token) return;

          const response = await axios.get(`https://37prw4st-5000.asse.devtunnels.ms/api/auth/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data && response.data.data && response.data.data.messages) {
            const messages = response.data.data.messages;
            const formattedMessages = messages.map((msg, index) => {
              const isSentByMe = msg.isSentByMe || false;
              const messageTime = msg.time || 'Invalid Time';
              const uniqueId = msg._id || `${Date.now()}-${index}-${Math.random()}`;

              // Treat as audio ONLY if audio exists and has a valid URL
              if (msg.audio && msg.audio.url) {
                return {
                  id: uniqueId,
                  audio: {
                    url: msg.audio.url,
                    duration: msg.audio.duration || null,
                    mimeType: msg.audio.mimeType || 'audio/mpeg',
                  },
                  type: isSentByMe ? 'sent' : 'received',
                  time: messageTime,
                  duration: msg.audio.duration ? `${Math.floor(msg.audio.duration)}s` : '0s'
                };
              }

              // Otherwise, if text exists, treat as text message
              if (msg.text && msg.text.trim() !== '') {
                return {
                  id: uniqueId,
                  text: msg.text,
                  type: isSentByMe ? 'sent' : 'received',
                  time: messageTime
                };
              }

              // Skip messages without usable text or audio
              return null;
            }).filter(Boolean);

            setMessages(formattedMessages);

            // Scroll to bottom after refresh with slightly longer delay for better performance
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 150);
          }
        } catch (error) {
          console.log('Chat refresh failed:', error);
        }
      };

      refreshChat();
    }
  }, [refreshTrigger, userId]);

  // Refresh chat when screen gains focus (user returns to chat)
  useFocusEffect(
    React.useCallback(() => {
      console.log('Chat screen focused, refreshing messages');
      setRefreshTrigger(prev => prev + 1);

      // Auto-scroll to bottom when screen gains focus
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }, [])
  );

  useEffect(() => {
    let isActive = true;
    const initSocket = async () => {
      try {
        const myId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('userToken');
        if (!myId || !token) return;
        const socket = connectSocket(token);

        // Add connection debugging
        socket.on('connect', () => {
          console.log('Socket connected for chat:', myId);
          console.log('Socket ID:', socket.id);
        });

        socket.on('disconnect', () => {
          console.log('Socket disconnected for chat');
        });

        socket.on('connect_error', (error) => {
          console.log('Socket connection error:', error);
        });

        // Listen for incoming messages
        socket.off('privateMessage');
        socket.on('privateMessage', (msg) => {
          console.log('Received privateMessage in chat:', msg);
          if (!isActive) return;

          // Only handle messages relevant to this open chat
          const senderId = msg.sender?._id || msg.sender;
          const recipientId = msg.recipient?._id || msg.recipient;

          if ((String(senderId) === String(userId) && String(recipientId) === String(myId)) ||
            (String(senderId) === String(myId) && String(recipientId) === String(userId))) {

            console.log('Message is relevant to this chat, triggering refresh');
            // Trigger refresh to get the complete updated conversation
            setRefreshTrigger(prev => prev + 1);
          }
        });
      } catch (e) {
        console.warn('Socket init error (chat):', e);
      }
    };
    initSocket();

    return () => {
      isActive = false;
      try {
        const socket = getSocket();
        socket?.off('privateMessage');
      } catch { }
    };
  }, [userId, currentUserId]);

  const handleSendMessage = async (audioUri = null) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        return;
      }

      const tempId = `${Date.now()}-${Math.random()}`;
      const messageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Create the new message object
      const newMessage = audioUri
        ? {
          id: tempId,
          audio: {
            url: audioUri,
            duration: Math.round(recordingDuration),
            mimeType: 'audio/m4a'
          },
          type: 'sent',
          time: messageTime,
          duration: `${Math.round(recordingDuration)}s`
        }
        : {
          id: tempId,
          text: input,
          type: 'sent',
          time: messageTime
        };

      // Add to UI immediately
      setMessages(prev => [...prev, newMessage]);
      setInput('');
      setIsRecording(false);
      setShowRecordingUI(false);
      setRecordingDuration(0);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Send to server
      if (audioUri) {
        const formData = new FormData();
        formData.append('audio', {
          uri: audioUri,
          type: 'audio/m4a',
          name: `audio_${tempId}.m4a`,
        });
        formData.append('duration', Math.round(recordingDuration));
        formData.append('recipientId', userId);

        const response = await axios.post(
          'https://37prw4st-5000.asse.devtunnels.ms/api/messages/private',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        // Replace temporary message with server response
        if (response.data && response.data.data) {
          const serverMessage = response.data.data;
          setMessages(prev =>
            prev.map(msg =>
              msg.id === tempId
                ? {
                  id: serverMessage._id || tempId,
                  audio: {
                    url: serverMessage.audio?.url || audioUri,
                    duration: serverMessage.audio?.duration || Math.round(recordingDuration),
                    mimeType: serverMessage.audio?.mimeType || 'audio/m4a'
                  },
                  type: 'sent',
                  time: new Date(serverMessage.createdAt || Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  }),
                  duration: serverMessage.audio?.duration ? `${Math.floor(serverMessage.audio.duration)}s` : `${Math.round(recordingDuration)}s`
                }
                : msg
            )
          );
        }

        // Trigger chat refresh after successful message send (with small delay)
        setTimeout(() => {
          setRefreshTrigger(prev => prev + 1);
        }, 500);
      } else {
        // For text messages, also emit via socket for real-time delivery
        try {
          const socket = getSocket();
          if (socket) {
            socket.emit('sendPrivateMessage', {
              recipientId: userId,
              text: input
            });
          }
        } catch (socketError) {
          console.log('Socket emit error, falling back to HTTP:', socketError);
        }

        // Send via HTTP as fallback or primary
        const response = await axios.post(
          'https://37prw4st-5000.asse.devtunnels.ms/api/messages/private',
          {
            recipientId: userId,
            text: input,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Replace temporary message with server response
        if (response.data && response.data.data) {
          const serverMessage = response.data.data;
          setMessages(prev =>
            prev.map(msg =>
              msg.id === tempId
                ? {
                  id: serverMessage._id || tempId,
                  text: serverMessage.text,
                  type: 'sent',
                  time: new Date(serverMessage.createdAt || Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }
                : msg
            )
          );
        }

        // Trigger chat refresh after successful message send (with small delay)
        setTimeout(() => {
          setRefreshTrigger(prev => prev + 1);
        }, 500);
      }
      // After sending and updating UI, fetch latest messages
      await fetchData();
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the temporary message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      Alert.alert("Error", "Failed to send message");
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        // eslint-disable-next-line import/namespace
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      recordingRef.current = recording;

      setIsRecording(true);
      setShowRecordingUI(true);
      setRecordingDuration(0);
      setRecordingWaveform(Array(20).fill(5));

      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 0.1);
        setRecordingWaveform(prev => prev.map(() => Math.random() * 20 + 5));
      }, 100);

    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert("Error", "Couldn't start recording");
    }
  };

  const stopRecording = async () => {
    try {
      clearInterval(recordingIntervalRef.current);

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('Audio file not found');
      }

      await handleSendMessage(uri);
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert("Error", "Failed to save recording");
    } finally {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    }
  };

  const cancelRecording = async () => {
    try {
      clearInterval(recordingIntervalRef.current);
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
      }
    } catch (err) {
      console.error('Failed to cancel recording', err);
    } finally {
      setIsRecording(false);
      setShowRecordingUI(false);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    }
  };

  const handlePlayAudio = async (audioUrl) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert("Error", "Couldn't play audio message");
    }
  };

  const renderItem = ({ item }) => {
    if (item.audio) {
      return (
        <AudioMessage
          isSentByUser={item.type === 'sent'}
          duration={item.duration}
          time={item.time}
          audioUrl={item.audio.url}
        />
      );
    } else {
      return (
        <View
          style={[
            styles.messageContainer,
            item.type === 'sent' ? styles.sent : styles.received,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              item.type === 'received' && { color: '#000' },
            ]}
          >
            {item.text}
          </Text>
          <Text style={[
            styles.timeText,
            item.type === 'sent' ? styles.sentTimeText : styles.receivedTimeText
          ]}>
            {item.time}
          </Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 35 : 30}
      >

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <MessageHeader
              // onBackPress={() => navigation.goBack()}
              userName={recipient.name}
              timestamp={new Date(recipient.lastActive).toLocaleTimeString()}
              onMenuPress={() => console.log('Menu pressed')}
              profileImage={recipient.pic}
              userInitials={recipient.name.split(' ').map(n => n[0]).join('')}
            />

            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.chatContainer}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
              bounces={true}
              alwaysBounceVertical={true}
              keyboardShouldPersistTaps="handled"
              maintainVisibleContentPosition={{
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 10
              }}
              removeClippedSubviews={false}
              maxToRenderPerBatch={50}
              windowSize={10}
              initialNumToRender={20}
            />

            <View style={styles.inputContainer}>
              {showRecordingUI ? (
                <View style={styles.recordingView}>
                  <TouchableOpacity onPress={cancelRecording} style={styles.recordingCancelButton}>
                    <Ionicons name="close" size={24} color="red" />
                  </TouchableOpacity>

                  <View style={styles.recordingActiveIndicator}>
                    <View style={styles.recordingDot} />
                    <Text style={styles.recordingText}>Recording...</Text>
                  </View>

                  <View style={styles.recordingWaveform}>
                    {recordingWaveform.map((height, index) => (
                      <View
                        key={`wave-${index}`}
                        style={[styles.recordingWaveBar, { height }]}
                      />
                    ))}
                  </View>

                  <Text style={styles.recordingDuration}>
                    {Math.round(recordingDuration)}
                  </Text>

                  <TouchableOpacity
                    onPress={stopRecording}
                    style={styles.sendRecordingButton}
                  >
                    <Ionicons name="send" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingBottom: height * 0.01 }}
                  >

                    <TextInput
                      placeholder="Message..."
                      placeholderTextColor="#999"
                      ref={inputRef}
                      style={[globalStyles.input]}
                      value={input}
                      onChangeText={setInput}
                      multiline
                      onFocus={() => {
                        // Scroll to bottom when input is focused - multiple attempts for reliability
                        setTimeout(() => {
                          flatListRef.current?.scrollToEnd({ animated: true });
                        }, 50);
                        // Additional scroll after keyboard animation
                        setTimeout(() => {
                          flatListRef.current?.scrollToEnd({ animated: true });
                        }, 300);
                      }}
                    />

                    <TouchableOpacity
                      onPress={() => input.trim() ? handleSendMessage() : startRecording()}
                      onLongPress={startRecording}
                    >
                      {input.trim() ? (
                        <Ionicons name="send" size={28} color="#694df0" />
                      ) : (
                        <Ionicons
                          name={isRecording ? "mic-off" : "mic"}
                          size={28}
                          color={isRecording ? "red" : "#694df0"}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#f9fafb',
    flex: 1,
  },
  chatContainer: {
    padding: 10,
    paddingBottom: 10,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
  },
  sent: {
    backgroundColor: '#694df0',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  received: {
    backgroundColor: '#e4e6eb',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
  },
  timeText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  sentTimeText: {
    alignSelf: 'flex-end',
  },
  receivedTimeText: {
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: height * 0.2,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
  },
  recordingView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  recordingActiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    marginRight: 6,
  },
  recordingText: {
    fontSize: 16,
    color: '#666',
  },
  recordingWaveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginHorizontal: 10,
  },
  recordingWaveBar: {
    width: 2,
    marginHorizontal: 1,
    backgroundColor: '#694df0',
    minHeight: 5,
  },
  recordingDuration: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  recordingCancelButton: {
    marginRight: 5,
  },
  sendRecordingButton: {
    backgroundColor: '#694df0',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatMessage;