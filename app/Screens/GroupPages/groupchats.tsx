import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation, useFocusEffect } from 'expo-router';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { WebView } from 'react-native-webview';
import {
    Dimensions,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ActivityIndicator,
    Alert,
    Image, SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useGroup } from "@/context/GroupContext";
import AttachmentOptions from '../../Components/Group_Components/AttachmentOptions';
import AssignmentCard from '../../Components/Group_Features/School/AssignmentCard';
import QuizCard from '../../Components/Group_Features/School/QuizCard';
import EventCard from '../../Components/Group_Features/School/StudyEventCard';
import PollItem from '../../Components/Group_Features/PollItem';
import ResourceCard from '@/app/Components/Group_Features/School/ResourceCard';
import HomeCard from '@/app/Components/Group_Features/Home/HomeCard';
import AudioMessage from '@/app/Components/AudioMessage';
//import cards for travel 
import ItineraryCard from '@/app/Components/Group_Features/Travel/ItineraryCard';
import CheckListCard from '@/app/Components/Group_Features/Travel/CheckListCard';
import SplitExpenseCard from '@/app/Components/Group_Features/Travel/SplitExpenseCard';
import TaskCard from '@/app/Components/Group_Features/CardComponent';
import CardComponent from '@/app/Components/Group_Features/CardComponent'
import FeatureCard from '@/app/Components/Group_Features/FeatureCard';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

import MessageHeader from '@/app/Components/MessageHeader';
import { connectSocket, getSocket } from '@/utils/socket';
import { globalStyles } from '@/Styles/globalStyles';


const { width, height } = Dimensions.get('window');

// Helper function to format duration consistently
const formatDuration = (seconds) => {
    if (typeof seconds === 'string') {
        // If it's already formatted like "0:14" or has 's' like "14s", handle it
        if (seconds.includes(':')) return seconds;
        seconds = parseInt(seconds.replace('s', ''));
    }
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const GroupChatScreen = () => {
    const navigation = useNavigation();
    const { groupData } = useGroup();
    const { groupId, groupName, groupType } = groupData;
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [recordingWaveform, setRecordingWaveform] = useState([]);
    const recordingRef = useRef(null);
    const recordingIntervalRef = useRef(null);
    const [showRecordingUI, setShowRecordingUI] = useState(false);

    console.log(`Group Chats Screen: GroupID: ${groupId}, GroupName: ${groupName}, GroupType: ${groupType}`);

    const [userId, setUserId] = useState(null);
    const inputRef = useRef();
    const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null);
    const [isVoting, setIsVoting] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            await recording.startAsync();
            recordingRef.current = recording;

            setIsRecording(true);
            setShowRecordingUI(true);
            setRecordingDuration(0);

            // Start waveform animation
            setRecordingWaveform(Array(20).fill(5));

            // Update duration and waveform
            recordingIntervalRef.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
                setRecordingWaveform(prev =>
                    prev.map(() => Math.random() * 20 + 5)
                );
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

            // Get the audio file info
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) {
                throw new Error('Audio file not found');
            }

            await handleSendMessage(uri, recordingDuration);

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


    const getInitials = (name) => {
        if (!name) return '';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };


    const handlePlusPress = () => {
        Keyboard.dismiss();
        setShowAttachmentOptions((prev) => !prev);
    };

    const formatSchoolContent = (content) => {
        return content.map(item => {
            if (item.dueDate) { // Assignment
                return {
                    id: item._id,
                    type: 'assignment',
                    title: item.title,
                    description: item.description,
                    dueDate: item.dueDate,
                    creator: item.createdBy,
                    creatorId: item.createdBy?._id,
                    createdAt: item.createdAt,
                    time: new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                };
            } else if (item.questions) { // Quiz
                return {
                    id: item._id,
                    type: 'quiz',
                    title: item.title,
                    category: item.category || "General",
                    questionCount: item.questions.length,
                    creatorId: item.createdBy?._id,
                    createdAt: item.createdAt,
                    time: new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                };
            } else if (item.date) { // Event
                return {
                    id: item._id,
                    type: 'event',
                    title: item.title,
                    description: item.description,
                    date: item.date,
                    creatorId: item.createdBy?._id,
                    createdAt: item.createdAt,
                    time: new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                };
            }
            return null;
        }).filter(Boolean);
    };

    const fetchGroupMessages = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const id = await AsyncStorage.getItem('userId');
            setUserId(id);

            if (!token) return console.error('Token not found');

            const endpoint = `https://chatrio-backend.onrender.com/api/messages/${groupId}/${groupType.toLowerCase()}`;
            console.log(`Fetching from endpoint: ${endpoint}`);

            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('API Response:', response.data);
            if (groupType.toLowerCase() === 'school') {
                const {
                    messages: msgArr = [],
                    assignments: assignmentArr = [],
                    quizzes: quizArr = [],
                    events: eventArr = [],
                    resources: resourceArr = []
                } = response.data || {};


                const formattedMessages = msgArr.map((msg) => {
                    if (msg.audio) {
                        return {
                            id: msg._id,
                            type: 'audio',
                            audioUrl: msg.audio.url,
                            duration: formatDuration(msg.audio.duration || 0),
                            senderId: msg.sender._id,
                            senderName: msg.sender.name,
                            senderPic: msg.sender.pic,
                            createdAt: msg.createdAt,
                            time: new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                        };
                    }
                    return {
                        id: msg._id,
                        type: 'text',
                        text: msg.text,
                        senderId: msg.sender._id,
                        senderName: msg.sender.name,
                        senderPic: msg.sender.pic,
                        createdAt: msg.createdAt,
                        time: new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        }),
                    };
                });
                const formattedResources = resourceArr.map(resource => ({
                    id: resource._id,
                    type: 'resource',
                    title: resource.title,
                    fileUrl: resource.fileUrl,
                    fileType: resource.fileType,
                    uploadedBy: resource.createdBy || { _id: resource.uploadedBy },
                    createdAt: resource.createdAt,
                    time: new Date(resource.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }));

                const formattedAssignments = formatSchoolContent(assignmentArr);
                const formattedQuizzes = formatSchoolContent(quizArr);
                const formattedEvents = formatSchoolContent(eventArr);

                const allContent = [
                    ...formattedMessages,
                    ...formattedAssignments,
                    ...formattedQuizzes,
                    ...formattedEvents,
                    ...formattedResources
                ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                setMessages(allContent);

            } else if (groupType.toLowerCase() === 'home') {
                const {
                    messages: msgArr = [],
                    shoppingLists: shoppingArr = [],
                    budgets: budgetArr = [],
                    chores: choreArr = [],
                    events: eventArr = [],
                    reminders: reminderArr = []
                } = response.data || {};

                const formattedMessages = msgArr.map((msg) => {
                    if (msg.audio) {
                        return {
                            id: msg._id,
                            type: 'audio',
                            audioUrl: msg.audio.url,
                            duration: formatDuration(msg.audio.duration || 0),
                            senderId: msg.sender._id,
                            senderName: msg.sender.name,
                            senderPic: msg.sender.pic,
                            createdAt: msg.createdAt,
                            time: new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                        };
                    }
                    return {
                        id: msg._id,
                        type: 'text',
                        text: msg.text,
                        senderId: msg.sender._id,
                        senderName: msg.sender.name,
                        senderPic: msg.sender.pic,
                        createdAt: msg.createdAt,
                        time: new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        }),
                    };
                });

                const formattedShopping = shoppingArr.map(item => ({
                    id: item._id,
                    type: 'shopping',
                    title: item.name,
                    subText: item.quantity,
                    creatorId: item.createdBy?._id,
                    createdAt: item.createdAt,
                    time: new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),

                    isPurchased: item.isPurchased
                }));

                const formattedBudgets = budgetArr.map(item => ({
                    id: item._id,
                    type: 'budget',
                    title: item.title,
                    amount: item.amount,
                    budgetType: item.type,
                    subText: item.category,
                    createdAt: item.createdAt,
                    time: new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    creatorId: item.createdBy?._id
                }));

                const formattedChores = choreArr.map(item => ({
                    id: item._id,
                    type: 'chores',
                    title: item.task,
                    date: new Date(item.dueDate).toLocaleDateString(),
                    user: item.assignedTo?.name,
                    completed: item.isCompleted,
                    createdAt: item.createdAt,
                    time: new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    creatorId: item.assignedTo?._id
                }));

                const formattedEvents = eventArr.map(item => ({
                    id: item._id,
                    type: 'event',
                    title: item.title,
                    description: item.description,
                    date: item.date,
                    creatorId: item.createdBy?._id,
                    createdAt: item.createdAt,
                    time: new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }));

                const formattedReminders = reminderArr.map(item => ({
                    id: item._id,
                    type: 'reminder',
                    title: item.message,
                    subText: 'Reminder',
                    date: new Date(item.reminderTime).toLocaleString(),
                    user: item.createdBy?.name,
                    createdAt: item.createdAt,
                    time: new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    creatorId: item.createdBy?._id
                }));

                const allContent = [
                    ...formattedMessages,
                    ...formattedShopping,
                    ...formattedBudgets,
                    ...formattedChores,
                    ...formattedEvents,
                    ...formattedReminders
                ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                setMessages(allContent);
            } else if (groupType.toLowerCase() === 'travel') {
                const {
                    messages: msgArr = [],
                    locations: locationArr = [],
                    itineraries: itineraryArr = [],
                    travelDocuments: documentArr = [],
                    checklists: checklistArr = [],
                    expenses: expenseArr = []
                } = response.data || {};

                // Format regular messages
                const formattedMessages = msgArr.map((msg) => {
                    if (msg.audio) {
                        return {
                            id: msg._id,
                            type: 'audio',
                            audioUrl: msg.audio.url,
                            duration: formatDuration(msg.audio.duration || 0),
                            senderId: msg.sender._id,
                            senderName: msg.sender.name,
                            senderPic: msg.sender.pic,
                            createdAt: msg.createdAt,
                            time: new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                        };
                    }
                    return {
                        id: msg._id,
                        type: 'text',
                        text: msg.text,
                        senderId: msg.sender._id,
                        senderName: msg.sender.name,
                        senderPic: msg.sender.pic,
                        createdAt: msg.createdAt,
                        time: new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        }),
                    };
                });

                // Format locations
                const formattedLocations = locationArr.map((loc) => ({
                    id: loc._id,
                    type: 'location',
                    senderId: loc.sender?._id,
                    senderName: loc.sender?.name || 'Shared Location',
                    coordinates: loc.coordinates,
                    locationName: loc.locationName || 'Location',
                    createdAt: loc.createdAt,
                    time: new Date(loc.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }));

                // Format itineraries
                const formattedItineraries = itineraryArr.map(item => ({
                    id: item._id,
                    type: 'itinerary',
                    title: item.title,
                    description: item.description,
                    startDate: item.times.startDate,
                    endDate: item.times.endDate,
                    route: item.route,
                    destinations: item.destinations,
                    transportation: item.transportation,
                    accommodations: item.accommodations,
                    creatorId: item.sender?._id,
                    createdAt: item.createdAt,
                    time: new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }));

                // Format travel documents
                const formattedDocuments = documentArr.map(item => ({
                    id: item._id,
                    type: 'travelDocument',
                    title: item.title,
                    fileUrl: item.fileUrl,
                    senderId: item.sender?._id,
                    senderName: item.sender?.name,
                    createdAt: item.createdAt,
                    time: new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }));

                // Format checklists
                const formattedChecklists = checklistArr.map(item => ({
                    id: item._id,
                    type: 'travelChecklist',
                    title: item.destination,
                    startDate: item.travelDate.from,
                    endDate: item.travelDate.to,
                    items: item.items,
                    totalItems: item.items.length,
                    packedItems: item.items.filter(i => i.isPacked).length,
                    creatorId: item.sender?._id,
                    createdAt: item.createdAt,
                    time: new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }));

                // Format split expenses
                const formattedExpenses = expenseArr.map(item => ({
                    id: item._id,
                    type: 'splitExpense',
                    title: item.title,
                    amount: item.amount,
                    paidBy: item.paidBy,
                    sharedWith: item.sharedWith,
                    creatorId: item.sender?._id,
                    createdAt: item.createdAt,
                    time: new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }));

                const allContent = [
                    ...formattedMessages,
                    ...formattedLocations,
                    ...formattedItineraries,
                    ...formattedDocuments,
                    ...formattedChecklists,
                    ...formattedExpenses
                ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                setMessages(allContent);
            } else if (groupType.toLowerCase() === 'work') {

                const {
                    messages: msgArr = [],
                    poll: pollArr = [],
                    idea: ideaArr = [],
                    task: taskArr = [],
                    note: noteArr = [],
                    meeting: meetingArr = []
                } = response.data || {};

                // Format regular messages
                const formattedMessages = msgArr.map((msg) => {
                    if (msg.audio) {
                        return {
                            id: msg._id,
                            type: 'audio',
                            audioUrl: msg.audio.url,
                            duration: formatDuration(msg.audio.duration || 0),
                            senderId: msg.sender._id,
                            senderName: msg.sender.name,
                            senderPic: msg.sender.pic,
                            createdAt: msg.createdAt,
                            time: new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                        };
                    }
                    return {
                        id: msg._id,
                        type: 'text',
                        text: msg.text,
                        senderId: msg.sender._id,
                        senderName: msg.sender.name,
                        senderPic: msg.sender.pic,
                        createdAt: msg.createdAt,
                        time: new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        }),
                    };
                });

                // Format polls
                const formattedPolls = pollArr.map((poll) => ({
                    id: poll._id,
                    type: 'poll',
                    senderId: poll.sender._id,
                    senderName: poll.sender.name,
                    senderPic: poll.sender.pic,
                    createdAt: poll.createdAt,
                    time: new Date(poll.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    question: poll.question,
                    options: poll.options,
                    votes: poll.votes || [],
                }));

                // Format ideas
                const formattedIdeas = ideaArr.map(idea => ({
                    id: idea._id,
                    type: 'idea',
                    title: idea.title,
                    content: idea.content,
                    senderId: idea.sender._id,
                    senderName: idea.sender.name,
                    senderPic: idea.sender.pic,
                    createdAt: idea.createdAt,
                    time: new Date(idea.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }));

                // Format tasks
                const formattedTasks = taskArr.map(task => ({
                    id: task._id,
                    type: 'task',
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    startTime: task.startTime,
                    endTime: task.endTime,
                    senderId: task.sender._id,
                    senderName: task.sender.name,
                    senderPic: task.sender.pic,
                    createdAt: task.createdAt,
                    time: new Date(task.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }));

                // Format notes
                const formattedNotes = noteArr.map(note => ({
                    id: note._id,
                    type: 'note',
                    title: note.title,
                    content: note.content,
                    senderId: note.sender._id,
                    senderName: note.sender.name,
                    senderPic: note.sender.pic,
                    createdAt: note.createdAt,
                    time: new Date(note.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }));

                // Format meetings
                const formattedMeetings = meetingArr.map(meeting => ({
                    id: meeting._id,
                    type: 'meeting',
                    topic: meeting.topic,
                    startTime: meeting.start_time,
                    duration: meeting.duration,
                    joinUrl: meeting.join_url,
                    meetingId: meeting.meeting_id,
                    senderId: meeting.sender._id,
                    senderName: meeting.sender.name,
                    senderPic: meeting.sender.pic,
                    createdAt: meeting.createdAt,
                    time: new Date(meeting.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }));

                const allContent = [
                    ...formattedMessages,
                    ...formattedPolls,
                    ...formattedIdeas,
                    ...formattedTasks,
                    ...formattedNotes,
                    ...formattedMeetings
                ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                setMessages(allContent);

            } else {
                const { messages: msgArr = [], poll: pollArr = [], location: locationArr = [] } = response.data || {};

                const formattedMessages = msgArr.map((msg) => ({
                    id: msg._id,
                    type: 'text',
                    text: msg.text,
                    senderId: msg.sender._id,
                    senderName: msg.sender.name,
                    senderPic: msg.sender.pic,
                    createdAt: msg.createdAt,
                    time: new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }));

                const formattedLocations = locationArr.map((loc) => ({
                    id: loc._id,
                    type: 'location',
                    senderId: loc.user,
                    senderName: 'Shared Location',
                    createdAt: loc.createdAt,
                    time: new Date(loc.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    coordinates: loc.coordinates,
                    locationName: loc.locationName || 'Location',
                }));

                const formattedPolls = pollArr.map((poll) => ({
                    id: poll._id,
                    type: 'poll',
                    senderId: poll.sender?._id || '',
                    senderName: poll.sender?.name || 'Unknown',
                    senderPic: poll.sender?.pic || '',
                    createdAt: poll.createdAt,
                    time: new Date(poll.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    question: poll.question,
                    options: poll.options,
                    votes: poll.votes || [],
                }));

                const merged = [
                    ...formattedMessages,
                    ...formattedPolls,
                    ...formattedLocations
                ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                setMessages(merged);
            }

        } catch (error) {
            console.error('Error fetching group messages:', error);
            Alert.alert('Error', 'Failed to load group data');
        } finally {
            setLoading(false);
        }
    }, [groupId, groupType]);

    useEffect(() => {
        fetchGroupMessages();
    }, [groupId, groupType, fetchGroupMessages]);

    // Refresh group messages when refreshTrigger changes (after message sent)
    useEffect(() => {
        if (refreshTrigger > 0) {
            console.log('Refreshing group messages due to trigger');
            fetchGroupMessages();
        }
    }, [refreshTrigger, groupId, groupType, fetchGroupMessages]);

    // Refresh when screen gains focus (user returns to group chat)
    useFocusEffect(
        React.useCallback(() => {
            console.log('Group chat screen focused, refreshing messages');
            setRefreshTrigger(prev => prev + 1);
        }, [])
    );

    // Socket listener for group messages
    useEffect(() => {
        let isActive = true;
        const initSocket = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) return;
                const socket = connectSocket(token);

                // Listen for group messages
                socket.off('groupMessage');
                socket.on('groupMessage', (msg) => {
                    console.log('Received groupMessage:', msg);
                    if (!isActive) return;

                    // Check if message is for this group
                    if (String(msg.group) === String(groupId)) {
                        console.log('Group message is relevant, triggering refresh');
                        setRefreshTrigger(prev => prev + 1);
                    }
                });

                // Join the group room
                socket.emit('joinGroup', groupId);
                console.log('Joined group room:', groupId);

            } catch (e) {
                console.warn('Socket init error (group chat):', e);
            }
        };
        initSocket();

        return () => {
            isActive = false;
            try {
                const socket = getSocket();
                socket?.off('groupMessage');
            } catch { }
        };
    }, [groupId]);

    // Auto-scroll to latest message when chat opens (like WhatsApp)
    useEffect(() => {
        if (messages.length > 0 && flatListRef.current) {
            // Small delay to ensure FlatList is fully rendered
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: false });
            }, 100);
        }
    }, [messages.length]); // Trigger when messages are loaded

    // Auto-scroll to bottom when screen comes into focus (like WhatsApp)
    useFocusEffect(
        useCallback(() => {
            if (messages.length > 0 && flatListRef.current) {
                // Delay to ensure the screen is fully focused
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 200);
            }
        }, [messages.length])
    );

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        });

        return () => keyboardDidShowListener.remove();
    }, []);
    const handleSendMessage = async (audioUri = null, duration = null) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const senderId = await AsyncStorage.getItem('userId');

            // For audio messages
            if (audioUri) {
                const formData = new FormData();
                formData.append('groupId', groupId);
                formData.append('senderId', senderId);
                formData.append('duration', duration.toString());

                // Get file info
                const fileInfo = await FileSystem.getInfoAsync(audioUri);
                const fileType = 'audio/m4a'; // or detect from file extension

                formData.append('audio', {
                    uri: audioUri,
                    name: `audio_${Date.now()}.m4a`,
                    type: fileType,
                });

                const response = await axios.post(
                    'https://chatrio-backend.onrender.com/api/messages/group',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        },
                    }
                );

                const newMsg = response.data;
                const formattedMessage = {
                    id: newMsg._id,
                    type: 'audio',
                    audioUrl: newMsg.audio.url,
                    duration: formatDuration(duration),
                    senderId: newMsg.sender._id,
                    senderName: newMsg.sender.name,
                    senderPic: newMsg.sender.pic,
                    createdAt: newMsg.createdAt,
                    time: new Date(newMsg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                };

                setMessages((prev) => [...prev, formattedMessage]);
                // Fetch latest messages after sending
                await fetchGroupMessages();
            }
            // For text messages
            else if (input.trim()) {
                const response = await axios.post(
                    'https://chatrio-backend.onrender.com/api/messages/group',
                    {
                        groupId,
                        senderId,
                        text: input.trim()
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const newMsg = response.data;
                const formattedMessage = {
                    id: newMsg._id,
                    type: 'text',
                    text: newMsg.text,
                    senderId: newMsg.sender._id,
                    senderName: newMsg.sender.name,
                    senderPic: newMsg.sender.pic,
                    createdAt: newMsg.createdAt,
                    time: new Date(newMsg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                };

                setMessages((prev) => [...prev, formattedMessage]);
                setInput('');
                // Fetch latest messages after sending
                await fetchGroupMessages();
            }

            // Remove the old setTimeout/refreshTrigger logic
            // flatListRef.current?.scrollToEnd({ animated: true });
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert("Error", "Failed to send message");
        } finally {
            setIsRecording(false);
            setShowRecordingUI(false);
        }
    };
    const handleVote = async (pollId, optionIndex) => {
        if (isVoting) return;

        try {
            setIsVoting(true);
            const token = await AsyncStorage.getItem('userToken');

            setMessages(prevMessages =>
                prevMessages.map(msg => {
                    if (msg.id === pollId && msg.type === 'poll') {
                        const hasVoted = msg.votes?.some(v => String(v.user) === String(userId));
                        if (hasVoted) {
                            Alert.alert("Already Voted", "You have already voted in this poll");
                            return msg;
                        }

                        const newVotes = [
                            ...(msg.votes || []),
                            { user: userId, optionIndex }
                        ];
                        return { ...msg, votes: newVotes };
                    }
                    return msg;
                })
            );

            const response = await axios.post(
                `https://chatrio-backend.onrender.com/api/work/poll/${pollId}/vote`,
                { optionIndex },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Vote failed');
            }

            fetchGroupMessages();
        } catch (error) {
            console.error("Voting error:", error);
            setMessages(prevMessages =>
                prevMessages.map(msg => {
                    if (msg.id === pollId && msg.type === 'poll') {
                        const revertedVotes = msg.votes?.filter(v => String(v.user) !== String(userId)) || [];
                        return { ...msg, votes: revertedVotes };
                    }
                    return msg;
                })
            );

            let errorMessage = 'Could not submit your vote';
            if (error.response) {
                if (error.response.data.message.includes('already voted')) {
                    errorMessage = 'You have already voted in this poll';
                } else if (error.response.status === 403) {
                    errorMessage = 'You must be a group member to vote';
                } else {
                    errorMessage = error.response.data.message || `Error: ${error.response.status}`;
                }
            }

            Alert.alert('Vote Failed', errorMessage);
        } finally {
            setIsVoting(false);
        }
    };

    const renderItem = ({ item }) => {
        if (!userId) return null;

        const isSentByUser = String(item.senderId || item.creatorId).trim() === String(userId).trim();

        const renderUserHeader = () => {
            if (isSentByUser) return null;

            return (
                <View style={styles.userHeader}>
                    <Image
                        source={
                            !item.senderPic || item.senderPic === 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                                ? require('../../../assets/images/user.jpg')
                                : { uri: item.senderPic }
                        }
                        style={styles.profilePic}
                    />
                    <Text style={[styles.userName, { color: '#694df0' }]}>
                        {item.senderName || item.creator?.name}
                    </Text>
                </View>
            );
        };

        // Home group specific items
        if (groupType.toLowerCase() === 'home' && ['shopping', 'budget', 'chores', 'reminder'].includes(item.type)) {
            return (
                <View style={[
                    styles.messageWrapper,
                    isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                ]}>
                    {renderUserHeader()}
                    <HomeCard
                        type={item.type}
                        title={item.title}
                        subText={item.subText}
                        date={item.date}
                        user={item.user}
                        completed={item.completed || item.isPurchased}
                        amount={item.amount?.toString()}
                        budgetType={item.budgetType}
                        time={item.time}
                        isSentByUser={isSentByUser}
                        onToggleCompleted={() => {
                            // Implement toggle functionality if needed
                        }}
                    />
                </View>
            );
        }

        if (item.type === 'audio') {
            return (
                <View style={[
                    styles.messageWrapper,
                    isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                ]}>
                    {renderUserHeader()}
                    <AudioMessage
                        isSentByUser={isSentByUser}
                        duration={item.duration || '0:00'}
                        time={item.time}
                        audioUrl={item.audioUrl}
                    />
                </View>
            );
        }
        if (item.type === 'poll') {
            return (
                <View style={[
                    styles.messageWrapper,
                    isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                ]}>
                    {renderUserHeader()}
                    <PollItem
                        poll={item}
                        isSentByUser={isSentByUser}
                        currentUserId={userId}
                        onVote={(optionIndex) => handleVote(item.id, optionIndex)}
                        isVoting={isVoting}
                    />
                    <Text style={[styles.messageTime, isSentByUser && { color: '#ccc' }]}>
                        {item.time}
                    </Text>
                </View>
            );
        }

        if (groupType.toLowerCase() === 'work') {
            if (item.type === 'task') {
                return (
                    <View style={[
                        styles.messageWrapper,
                        isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                    ]}>
                        {renderUserHeader()}
                        <TaskCard
                            isTask={true}
                            title={item.title}
                            description={item.description}
                            isSentByUser={isSentByUser}
                            dueDate={new Date(item.endTime).toISOString().split("T")[0]}
                            assignee={item.senderName}
                            status={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            time={item.time}
                            msgTime={item.time}
                        />
                    </View>
                );
            }

            if (item.type === 'meeting') {
                return (
                    <View style={[
                        styles.messageWrapper,
                        isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                    ]}>
                        {renderUserHeader()}
                        <CardComponent
                            isTask={false}
                            title={item.topic}
                            dueDate={item.startTime?.split('T')[0]}
                            time={new Date(item.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            platform="Zoom Meeting"
                            duration={`${item.duration} minutes`}
                            isSentByUser={isSentByUser}
                            participants={['M', 'S', 'A', 'Y']} // You might want to make this dynamic
                            onJoin={() => Linking.openURL(item.joinUrl)}
                            msgTime={item.time}
                        />
                    </View>
                );
            }

            if (item.type === 'idea') {
                return (
                    <View style={[
                        styles.messageWrapper,
                        isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                    ]}>
                        {renderUserHeader()}
                        <FeatureCard
                            title={item.title}
                            description={item.content}
                            isSentByUser={isSentByUser}
                            time={item.time}
                            type="idea"
                        />
                    </View>
                );
            }

            if (item.type === 'note') {
                return (
                    <View style={[
                        styles.messageWrapper,
                        isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                    ]}>
                        {renderUserHeader()}
                        <FeatureCard
                            title={item.title}
                            description={item.content}
                            isSentByUser={isSentByUser}
                            time={item.time}
                            type="note"
                        />
                    </View>
                );
            }
        }


        if (item.type === 'location') {
            return (
                <View style={[
                    styles.messageWrapper,
                    isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                ]}>
                    {renderUserHeader()}

                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: '/Screens/GroupPages/TravelPages/ViewSharedLocation',
                                params: {
                                    lat: item.coordinates.lat,
                                    lng: item.coordinates.lng,
                                    name: item.locationName
                                }
                            })
                        }
                    >
                        <View
                            style={[
                                styles.locationContainer,
                                {
                                    borderColor: isSentByUser ? '#694df0' : '#bcbdbfff',
                                    borderWidth: 3,
                                }
                            ]}
                        >
                            <WebView
                                originWhitelist={['*']}
                                source={{
                                    html: `<!DOCTYPE html><html><head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
                <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
                <style>html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; border-radius: 12px; }</style>
              </head><body>
                <div id="map"></div>
                <script>
                  var map = L.map('map', {
                    center: [${item.coordinates.lat}, ${item.coordinates.lng}],
                    zoom: 15,
                    zoomControl: false,
                    dragging: false,
                    doubleClickZoom: false,
                    scrollWheelZoom: false,
                    boxZoom: false,
                    keyboard: false,
                    tap: false,
                  });
                  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
                  L.marker([${item.coordinates.lat}, ${item.coordinates.lng}]).addTo(map);
                </script></body></html>`
                                }}
                                style={{ width: width * 0.64, height: height * 0.2, borderRadius: 12 }}
                                scrollEnabled={false}
                            />
                        </View>
                    </TouchableOpacity>

                    <Text style={[styles.messageTime, isSentByUser && { color: '#ccc' }]}>
                        {item.time}
                    </Text>
                </View>
            );
        }


        if (item.type === 'assignment') {
            return (
                <View style={[
                    styles.messageWrapper,
                    isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                ]}>
                    {renderUserHeader()}
                    <AssignmentCard
                        title={item.title}
                        dueDate={item.dueDate}
                        creatorName={item.creator?.name}
                        isSentByUser={isSentByUser}
                        time={item.time}
                        onPress={() => {
                            console.log("Assignment item data:", item);
                            router.push({
                                pathname: '/Screens/GroupPages/SchoolPages/SubmitAssignment',
                                params: {
                                    id: item.id,
                                    title: item.title,
                                    description: item.description,
                                    dueDate: item.dueDate,
                                    creatorName: item.creator?.name,
                                }
                            });
                        }}
                    />
                </View>
            );
        }

        if (item.type === 'quiz') {
            return (
                <View style={[
                    styles.messageWrapper,
                    isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                ]}>
                    {renderUserHeader()}
                    <QuizCard
                        title={item.title}
                        category={item.category}
                        questions={item.total || 10}
                        time={item.time}
                        score={0}
                        isSentByUser={isSentByUser}
                        onPress={() => {
                            router.push({
                                pathname: '/Screens/GroupPages/SchoolPages/AttemptQuiz',
                                params: {
                                    quizId: item.id || item._id,
                                },
                            });
                        }}
                    />
                </View>
            );
        }

        if (item.type === 'event') {
            return (
                <View style={[
                    styles.messageWrapper,
                    isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                ]}>
                    {renderUserHeader()}
                    <EventCard
                        title={item.title}
                        date={item.date}
                        type={item.title?.toLowerCase().includes("quiz") ? "Quiz" : "Assignment"}
                        isSentByUser={isSentByUser}
                        time={item.time}
                    />
                </View>
            );
        }

        if (item.type === 'resource') {


            return (
                <View style={[
                    styles.messageWrapper,
                    isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                ]}>
                    {renderUserHeader()}
                    <ResourceCard
                        title={item.title}
                        fileUrl={item.fileUrl}
                        time={item.time}
                        isSentByUser={isSentByUser}
                        onPress={() => {
                            router.push({
                                pathname: '/Screens/GroupPages/TravelPages/DocumentViewer',
                                params: {
                                    title: item.title,
                                    fileUrl: item.fileUrl,
                                }
                            });
                        }}
                    />
                </View>
            );
        }

        //populate the travel group features
        // if (item.type === 'itinerary') {
        //     return (
        //         <View style={[
        //             styles.messageWrapper,
        //             isSentByUser ? styles.sentWrapper : styles.receivedWrapper
        //         ]}>
        //             {renderUserHeader()}
        //             <ItineraryCard
        //                 title={item.title}
        //                 description={item.description}
        //                 startDate={item.startDate}
        //                 endDate={item.endDate}
        //                 route={item.route}
        //                 isSentByUser={isSentByUser}
        //                 time={item.time}
        //                 onPress={() => {
        //                     router.push({
        //                         pathname: '/Screens/GroupPages/TravelPages/ViewItinerary',
        //                         params: {
        //                             itineraryId: item.id,
        //                             title: item.title,
        //                             description: item.description,
        //                             startDate: item.startDate,
        //                             endDate: item.endDate,
        //                             route: item.route,
        //                             destinations: JSON.stringify(item.destinations),
        //                             transportation: JSON.stringify(item.transportation),
        //                             accommodations: JSON.stringify(item.accommodations)
        //                         }
        //                     });
        //                 }}
        //             />
        //         </View>
        //     );
        // }

        if (item.type === 'itinerary') {
            return (
                <View style={[
                    styles.messageWrapper,
                    isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                ]}>
                    {renderUserHeader()}
                    <ItineraryCard
                        title={item.title}
                        description={item.description}
                        startDate={item.startDate}
                        endDate={item.endDate}
                        route={item.route}
                        isSentByUser={isSentByUser}
                        time={item.time}
                        onPress={() => {
                            router.push({
                                pathname: '/Screens/GroupPages/TravelPages/DetailScreen',
                                params: {
                                    type: 'itinerary',
                                    data: JSON.stringify({
                                        title: item.title,
                                        description: item.description,
                                        route: item.route,
                                        destinations: item.destinations,
                                        transportation: item.transportation,
                                        accommodations: item.accommodations,
                                        // Include any other necessary fields
                                    }),
                                },
                            });
                        }}
                    />
                </View>
            );
        }

        // if (item.type === 'travelChecklist') {
        //     return (
        //         <View style={[
        //             styles.messageWrapper,
        //             isSentByUser ? styles.sentWrapper : styles.receivedWrapper
        //         ]}>
        //             {renderUserHeader()}

        //             <CheckListCard

        //                 title={item.title}
        //                 startDate={item.travelDate?.from}
        //                 endDate={item.travelDate?.to}
        //                 totalItems={item.totalItems}
        //                 packedItems={item.packedItems}
        //                 isSentByUser={isSentByUser}
        //                 time={item.time}
        //                 onPress={() => {
        //                     router.push({
        //                         pathname: '/Screens/GroupPages/TravelPages/DetailScreen',
        //                         params: {
        //                             _id: item.id,
        //                             type: 'checklist',
        //                             data: JSON.stringify(item),
        //                         },
        //                     });
        //                 }}
        //             />

        //         </View>
        //     );
        // }

        if (item.type === 'travelChecklist') {
            return (
                <View style={[
                    styles.messageWrapper,
                    isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                ]}>
                    {renderUserHeader()}
                    <CheckListCard
                        title={item.title}
                        startDate={item.startDate}
                        endDate={item.endDate}
                        totalItems={item.totalItems}
                        packedItems={item.packedItems}
                        isSentByUser={isSentByUser}
                        time={item.time}
                        onPress={() => {
                            router.push({
                                pathname: '/Screens/GroupPages/TravelPages/DetailScreen',
                                params: {
                                    type: 'checklist',
                                    data: JSON.stringify({
                                        _id: item.id,
                                        destination: item.title,
                                        travelDate: {
                                            from: item.startDate,
                                            to: item.endDate
                                        },
                                        items: item.items || [], // Make sure items array is included
                                        // Include any other necessary checklist fields
                                    }),
                                },
                            });
                        }}
                    />
                </View>
            );
        }

        if (item.type === 'splitExpense') {
            return (
                <View style={[
                    styles.messageWrapper,
                    isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                ]}>
                    {renderUserHeader()}

                    <SplitExpenseCard
                        title={item.title}
                        amount={item.amount}
                        date={item.createdAt}
                        paidBy={item.paidBy?.name}
                        isSentByUser={isSentByUser}
                        time={item.time}
                        onPress={() => {
                            router.push({
                                pathname: '/Screens/GroupPages/TravelPages/SplitPaid',
                                params: {

                                    data: JSON.stringify(item),
                                }
                            });
                        }}

                        splitWith={item.sharedWith}
                    />

                </View>
            );
        }

        if (item.type === 'travelDocument') {
            return (
                <View style={[
                    styles.messageWrapper,
                    isSentByUser ? styles.sentWrapper : styles.receivedWrapper
                ]}>
                    {renderUserHeader()}
                    <ResourceCard
                        title={item.title}
                        fileUrl={item.fileUrl}
                        time={item.time}
                        isSentByUser={isSentByUser}
                        onPress={() => {
                            router.push({
                                pathname: '/Screens/GroupPages/TravelPages/DocumentViewer',
                                params: {
                                    title: item.title,
                                    fileUrl: item.fileUrl,
                                }
                            });
                        }}
                    />
                </View>
            );
        }


        return (
            <View style={[
                styles.messageWrapper,
                isSentByUser ? styles.sentWrapper : styles.receivedWrapper
            ]}>
                {renderUserHeader()}
                <View
                    style={[
                        styles.messageContainer,
                        isSentByUser ? styles.sent : styles.received,
                    ]}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: isSentByUser ? '#fff' : '#000',
                        }}
                    >
                        {item.text}
                    </Text>
                </View>
                <Text style={[styles.messageTime, isSentByUser && { color: '#ccc' }]}>
                    {item.time}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 35 : 30}
            >

                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss();
                    if (showAttachmentOptions) {
                        setShowAttachmentOptions(false);
                    }
                }}>
                    <View style={{ flex: 1 }}>
                        <MessageHeader
                            onBackPress={() => navigation.goBack()}
                            userName={groupData.groupName}
                            timestamp=""
                            onMenuPress={() => { }}
                            profileImage='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR7jyJ8BtvuBGfBrjhuIlVMqk8tOWLYfOD8Q&s'
                        />
                        {loading ? (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="large" color="#694df0" />
                            </View>
                        ) : messages.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No messages yet</Text>
                            </View>
                        ) : (
                            <FlatList
                                ref={flatListRef}
                                data={messages}
                                keyExtractor={(item) => item.id}
                                renderItem={renderItem}
                                contentContainerStyle={styles.chatContainer}
                                onContentSizeChange={() =>
                                    flatListRef.current?.scrollToEnd({ animated: true })
                                }
                                showsVerticalScrollIndicator={false}
                            />
                        )}

                        {showAttachmentOptions && (
                            <TouchableWithoutFeedback>
                                <AttachmentOptions groupType={groupType} />
                            </TouchableWithoutFeedback>
                        )}

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
                                                style={[
                                                    styles.recordingWaveBar,
                                                    { height }
                                                ]}
                                            />
                                        ))}
                                    </View>

                                    <Text style={styles.recordingDuration}>
                                        {Math.floor(recordingDuration / 60)}:
                                        {(recordingDuration % 60).toString().padStart(2, '0')}
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

                                        <TouchableOpacity onPress={handlePlusPress} style={{ marginRight: 10 }}>
                                            <FontAwesome6 name="add" size={28} color="#694df0" />
                                        </TouchableOpacity>

                                        <TextInput
                                            placeholder="Message..."
                                            placeholderTextColor="#999"

                                            ref={inputRef}
                                            style={globalStyles.input}
                                            value={input}
                                            onChangeText={setInput}
                                            multiline
                                            onFocus={() => {
                                                flatListRef.current?.scrollToEnd({ animated: true });
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
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
    },
    chatContainer: {
        padding: 10,
    },
    messageWrapper: {
        marginBottom: 15,
    },
    sentWrapper: {
        alignItems: 'flex-end',
    },
    receivedWrapper: {
        alignItems: 'flex-start',
    },
    userHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    profilePic: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
    },
    userName: {
        fontSize: 14,
        fontWeight: '500',
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 12,
    },
    sent: {
        backgroundColor: '#694df0',
        borderTopRightRadius: 0,
    },
    received: {
        backgroundColor: '#e4e6eb',
        borderTopLeftRadius: 0,
    },
    messageTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    locationContainer: {
        width: width * 0.65,
        height: height * 0.2,
        borderRadius: 12,
        borderWidth: 2, // or 10 if you want thick borders
        overflow: 'hidden',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    // input: {
    //     flex: 1,
    //     borderWidth: 1,
    //     borderColor: '#ddd',
    //     borderRadius: 20,
    //     paddingHorizontal: 15,
    //     paddingVertical: 8,
    //     maxHeight: 100,
    //     marginRight: 10,
    // },
    // HomeCard specific styles
    card: {
        width: '80%',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    sentCard: {
        backgroundColor: '#694df0',
    },
    receivedCard: {
        backgroundColor: '#f0f0f0',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    subText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#999',
    },
    amountText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    budgetIconCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    choresSubText: {
        fontSize: 14,
        color: '#808080',
    },
    reminderDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#694df0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    reminderDotText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    reminderLabel: {
        backgroundColor: '#694df0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    reminderLabelText: {
        color: '#fff',
        fontSize: 12,
    },
    reminderDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    reminderInfoText: {
        fontSize: 12,
        color: '#808080',
        marginLeft: 4,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#808080',
    },
    recordingContainer: {
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 15,
    },
    recordingInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    // recordingWaveform: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     height: 40,
    //     flex: 1,
    //     marginHorizontal: 15,
    // },
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

export default GroupChatScreen;
