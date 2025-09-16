import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { groupStyle } from '@/Styles/groupStyle';
const { width, height } = Dimensions.get('window');

const ResourceCard = ({ 
  title, 
  creatorName = "Unknown", 
  isSentByUser = true,
  time,
  onPress ,
    fileUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/US_Passport_2023_cover.png/480px-US_Passport_2023_cover.png', // Replace with your URI

}) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.8} 
      style={[
        groupStyle.card,
        isSentByUser ? groupStyle.sentCard : groupStyle.receivedCard
      ]}
    >
      <View style={styles.content}>
        {/* Resource Title + icon */}
        <View style={[styles.row, { marginBottom: height * 0.01 }]}>
          <MaterialIcons name="folder" size={20} color={isSentByUser ? '#fff' : '#694df0'} />
          <Text style={[styles.title, { marginLeft: 5, fontSize: 20 }, isSentByUser && { color: '#fff' }]}>
            Resource
          </Text>
        </View>

        
        <Text style={[styles.title, { marginBottom: height * 0.01 }, isSentByUser && { color: '#fff' }]}>
          {title}
        </Text>

         <Image
                  source={{ uri: fileUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />

               

      
      </View>
       <Text style={[groupStyle.messageTime, isSentByUser && { color: '#ccc' }]}>
                        {time}
                    </Text>
    </TouchableOpacity>
  );
};

export default ResourceCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    width: width * 0.75,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginVertical: 4,
  },
  sentCard: {
    backgroundColor: '#694df0',
  },
   image: {
    width:  width * 0.66,
    height: height * 0.15,
    borderRadius: 8,
    marginVertical: height * 0.008,

  },
  receivedCard: {
    backgroundColor: '#e4e6eb',
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  text: {
    marginLeft: 6,
    color: '#555',
    fontSize: 13,
  },
});
