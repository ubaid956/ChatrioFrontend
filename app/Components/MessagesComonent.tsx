import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Dimensions
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

const { height, width } = Dimensions.get('window')
const MessageComponent = ({
  name,
  message,
  time,
  unreadCount,
  profileImage,
  onPress,
  isSelected,
  onLongPress
}) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isTablet = width >= 600;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          paddingHorizontal: isLandscape ? width * 0.05 : width * 0.04,
          paddingVertical: height * 0.001,
          backgroundColor: isSelected ? '#dbdbdb' : 'transparent',
        }
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={200}
    >
      {/* Selection Indicator */}


      <View style={styles.messageContainer}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={
              !profileImage || profileImage === 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                ? require('../../assets/images/user.jpg')
                : { uri: profileImage }
            }
            style={styles.profileImage}
          />
          {isSelected && (
            <View style={styles.selectionIndicator}>
              {/* <View style={styles.selectionCircle}> */}
              {/* <View style={styles.selectionCheckmark} /> */}
              <Ionicons name="checkmark-circle-sharp" size={24} color="#694df0" />
              {/* </View> */}
            </View>
          )}
        </View>

        {/* Message Content */}
        <View style={[styles.textContainer, { maxWidth: isTablet ? '70%' : '60%' }]}>
          <Text style={[
            styles.nameText,
            { fontSize: isTablet ? 18 : 16 }
          ]}>
            {name}
          </Text>
          <Text
            style={[
              styles.messageText,
              { fontSize: isTablet ? 16 : 14 }
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {message}
          </Text>
        </View>

        {/* Time and Unread */}
        <View style={styles.timeContainer}>
          <Text style={[
            styles.timeText,
            { fontSize: isTablet ? 14 : 12 }
          ]}>
            {time}
          </Text>
          {unreadCount > 0 && (
            <View style={[
              styles.unreadBadge,
              {
                width: isTablet ? 24 : 20,
                height: isTablet ? 24 : 20,
                borderRadius: isTablet ? 12 : 10,
              }
            ]}>
              <Text style={[
                styles.unreadText,
                { fontSize: isTablet ? 14 : 12 }
              ]}>
                {unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({

  messageContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffff',
    justifyContent: 'center',
    // shadowColor: '#5D5FEF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderRadius: 5,
    // elevation: 1,
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.02,
    marginVertical: 0,

    // margin: 10,
  },
  // profileImageContainer: {
  //   marginRight: 12,
  // },
  // profileImage: {
  //   backgroundColor: '#e1e1e1', // Fallback color if image fails to load
  // },
  profileImageContainer: {
    marginRight: 12,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden', // clips anything outside the border radius
  },
  profileImage: {
    backgroundColor: '#e1e1e1', // fallback color
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover', // ensures the image covers the area
  },

  textContainer: {
    flexShrink: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#000',
    marginBottom: 4,
    includeFontPadding: false,
  },
  messageText: {
    color: '#666',
    includeFontPadding: false,
  },
  timeContainer: {
    marginLeft: 'auto', // Pushes to the far right
    alignItems: 'flex-end',
    minWidth: 60,
  },
  timeText: {
    color: '#999',
    marginBottom: 4,
    includeFontPadding: false,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  selectionIndicator: {
    position: 'absolute',
    left: '50%',
    top: '80%',
    transform: [{ translateY: -18 }],
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',

  },
  selectionCircle: {
    width: 22,
    height: 22,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionCheckmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
});

export default MessageComponent;