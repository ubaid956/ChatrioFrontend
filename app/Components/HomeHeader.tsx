

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const moods = [
  { emoji: '💼', label: 'Work' },
  { emoji: '😌', label: 'Relaxed' },
  { emoji: '🎯', label: 'Focused' },
  { emoji: '🎉', label: 'Celebrating' },
];

// title: localized display string
// titleKey: language-independent key used for icon mapping (e.g. 'Home','Work','School','Travel')
const HomeHeader = ({ title, titleKey, time, avatar, createGroup, rightAction, rightText, iconName }) => {
  const [selectedMood, setSelectedMood] = useState({ emoji: '🎯', label: 'Focused' });
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Function to update the current time
  const updateCurrentTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCurrentTime(formattedTime);
  };

  // Update time immediately and set up interval for updates
  useEffect(() => {
    updateCurrentTime(); // Initial call

    // Update time every second for maximum accuracy
    const intervalId = setInterval(updateCurrentTime, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setModalVisible(false);
  };
  const renderIcon = () => {
    // If an explicit iconName prop is provided, use it (developer override)
    if (iconName) return <Ionicons name={iconName} size={20} color="#fff" style={styles.icon} />;

    // Map language-independent titleKey to icons; use titleKey (not localized title)
    const key = titleKey || title; // fall back to title if no key provided
    switch (key) {
      case 'Home':
        return <Ionicons name="home" size={20} color="#fff" style={styles.icon} />;
      case 'Work':
        return <Ionicons name="briefcase" size={20} color="#fff" style={styles.icon} />;
      case 'School':
        return <Ionicons name="school" size={20} color="#fff" style={styles.icon} />;
      case 'Travel':
        return <Ionicons name="globe" size={20} color="#fff" style={styles.icon} />;
      default:
        // Don't try to pass localized strings (like Arabic) as icon names — avoid warnings
        if (!createGroup) return <Ionicons name="ellipsis-horizontal" size={20} color="#fff" style={styles.icon} />;
        return null;
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.leftSection}>


          {!createGroup && (
            // <Ionicons name={title} size={20} color="#fff" style={styles.icon} />
            renderIcon()
          )}
          <Text style={styles.title}>{title}</Text>
        </View>

        <Text style={styles.time}>{currentTime}</Text>

        <View style={styles.rightSection}>
          {!createGroup && (
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.moodButton}>
              <Text style={styles.emoji}>{selectedMood.emoji}</Text>
            </TouchableOpacity>
          )}
          {!createGroup ? (
            <Image
              source={
                !avatar || avatar === 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                  ? require('../../assets/images/user.jpg')
                  : { uri: avatar }
              }
              style={styles.avatar}
            />
          ) : (
            <TouchableOpacity onPress={rightAction}>
              <Text style={styles.title}>{rightText || 'New Group'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Mood Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.popup}>
            <Text style={styles.selectMoodText}>Select Mood</Text>
            <View style={styles.emojiRow}>
              {moods.map((mood, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.emojiOption,
                    mood.label === selectedMood.label && styles.selectedMoodBox,
                  ]}
                  onPress={() => handleMoodSelect(mood)}
                >
                  <Text style={styles.emoji}>{mood.emoji}</Text>
                  {mood.label === selectedMood.label && (
                    <Text style={styles.selectedLabel}>{mood.label}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default HomeHeader;



const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: '#694df0',
    paddingVertical: height * 0.03,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingTop: height * 0.05

  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    marginRight: 4,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    color: '#fff',
    fontSize: 14,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  moodButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffffff30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 18,

  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000040',
  },
  popup: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
  },
  selectMoodText: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 12,
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emojiOption: {
    width: '45%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedMoodBox: {
    backgroundColor: '#e6f0ff',
  },
  selectedLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    color: '#2563EB',
  },
});
