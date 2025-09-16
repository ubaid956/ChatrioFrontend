import { Entypo, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const MessageHeader = ({
  onBackPress,
  userName = 'User Name',
  timestamp = '',
  onMenuPress,
  profileImage = '',
  userInitials = 'UN',
}) => {
  const renderAvatar = () => {
    if (!profileImage || profileImage === 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg') {
      return (
        <Image
          source={require('../../assets/images/user.jpg')}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      );
    }
    return (
      <Image
        source={{ uri: profileImage }}
        style={styles.avatarImage}
        resizeMode="cover"
      />
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.userInfo}>
        {renderAvatar()}
        <View style={styles.textContainer}>
          <Text style={styles.userName} numberOfLines={1}>
            {userName}
          </Text>
          {timestamp !== '' && (
            <Text style={styles.timestamp} numberOfLines={1}>
              {timestamp}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity onPress={onMenuPress}>
        <Entypo name="dots-three-vertical" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 4,
    // paddingTop: height*0.04,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5,

  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarFallback: {
    backgroundColor: '#ccc',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#000',
    fontWeight: 'bold',
  },
  textContainer: {
    marginLeft: 10,
    maxWidth: width * 0.55,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
});

export default MessageHeader;
