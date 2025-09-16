import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const tabs = [
  { label: 'Work', icon: 'briefcase' },
  { label: 'Home', icon: 'home' },
  { label: 'School', icon: 'school' },
  { label: 'Travel', icon: 'globe' }
];

const { height, width } = Dimensions.get('window')

const MyTabs = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;

        return (
          <TouchableOpacity
            key={tab.label}
            style={[styles.tabButton, isActive ? styles.activeTab : styles.inactiveTab]}
            onPress={() => onTabPress(tab.label)}
          >
            <Ionicons
              name={tab.icon}
              size={16}
              color={isActive ? '#fff' : '#374151'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.tabText, isActive ? styles.activeText : styles.inactiveText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default MyTabs;



const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
 
    paddingVertical: height * 0.02,
   
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1.5,
  },
  activeTab: {
    backgroundColor: '#5B3DF9', // Purple background
    borderColor: '#5B3DF9',
  },
  inactiveTab: {
    backgroundColor: '#fff',
    borderColor: '#d1d5db', // Tailwind gray-300
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: '#fff',
  },
  inactiveText: {
    color: '#374151', // Tailwind gray-700
  },
});
