import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const AttachmentOptions = ({ groupType }) => {
  const options = {
    Work: [
      {
        icon: 'bar-chart-outline',
        label: 'Create Poll',
        type: 'poll',
        route: '/Screens/GroupPages/CreateFeatures',
        params: { type: 'poll' }
      },
      {
        icon: 'checkmark-done-outline',
        label: 'Create Task',
        type: 'task',
        route: '/Screens/GroupPages/CreateFeatures',
        params: { type: 'task' }
      },
      {
        icon: 'calendar-outline',
        label: 'Schedule Meeting',
        type: 'meeting',
        route: '/Screens/GroupPages/CreateFeatures',
        params: { type: 'meeting' }
      },
      {
        icon: 'document-outline',
        label: 'Create Notes',
        type: 'note',
        route: '/Screens/GroupPages/CreateFeatures',
        params: { type: 'note' }
      },
      {
        icon: 'bulb',
        label: 'Create Ideas',
        type: 'note',
        route: '/Screens/GroupPages/CreateFeatures',
        params: { type: 'idea' }
      },
    ],
    School: [
      { icon: 'clipboard-outline', label: 'Create Assignment', type: 'assignment', route: '/Screens/GroupPages/SchoolPages/CreateAssignment' },
      { icon: 'school-outline', label: 'Create Quiz', type: 'quiz', route: '/Screens/GroupPages/SchoolPages/CreateQuiz' },
      {
        icon: 'book-outline',
        label: 'Resource Sharing',
        type: 'resource',
        route: '/Screens/GroupPages/TravelPages/UploadDocument',
        params: { context: 'school' }  // Explicitly pass context
      },
      {
        icon: 'chatbox-outline', // Added a more appropriate icon
        label: 'Message Teachers',
        type: 'message',
        route: '/Screens/GroupPages/feature4' // Changed to point directly to feature4
      },],
    Home: [
      { icon: 'cart-outline', label: 'Create Shopping List', type: 'shopping', route: '/Screens/GroupPages/HomePages/CreateShoppingList' },
      { icon: 'checkmark-circle-outline', label: 'Create Chores', type: 'chore', route: '/Screens/GroupPages/HomePages/CreateChore' },
      { icon: 'cash-outline', label: 'Create Budget', type: 'budget', route: '/Screens/GroupPages/HomePages/CreateBudget' },
      { icon: 'calendar-clear-outline', label: 'Create Event', type: 'event', route: '/Screens/GroupPages/HomePages/CreateEvent' },
    ],
    Travel: [
      { icon: 'map-outline', label: 'Create Itinerary', type: 'itinerary', route: '/Screens/GroupPages/TravelPages/CreateItinerary' },
      { icon: 'checkmark-circle-outline', label: 'Travel Checklist', type: 'checklist', route: '/Screens/GroupPages/TravelPages/CreateCheckList' },
      { icon: 'cash-outline', label: 'Split Expenses', type: 'expenses', route: '/Screens/GroupPages/TravelPages/CreateSplitExpense' },
      { icon: 'location-outline', label: 'Location Sharing', type: 'location', route: '/Screens/GroupPages/TravelPages/LocationSharingScreen' },
      {
        icon: 'document-outline',
        label: 'Send Documents',
        type: 'documents',
        route: '/Screens/GroupPages/TravelPages/UploadDocument',
        params: { context: 'travel' }  // Explicitly pass context
      }],
  };

  return (
    <View style={styles.container}>
      {(options[groupType] || []).map((opt, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionItem}
          onPress={() => router.push({
            pathname: opt.route || '/Screens/CreateFeatures', // fallback to CreateFeatures
            params: opt.params || { type: opt.type } // fallback to type if no params
          })}
        >
          <Ionicons name={opt.icon} size={20} style={styles.optionIcon} />
          <Text style={styles.optionText}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    width: width * 0.6,
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  optionIcon: {
    marginRight: 10,
    color: '#694df0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AttachmentOptions;
