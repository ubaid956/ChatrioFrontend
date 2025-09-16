import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { groupStyle } from '@/Styles/groupStyle';

const { width, height } = Dimensions.get('window');

const AssignmentCard = ({
  title,
  dueDate,
  creatorName = "Unknown",
  isSentByUser = false,
  onPress,
  time
}) => {
  const eventDate = new Date(dueDate);

  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        groupStyle.card,
        isSentByUser ? groupStyle.sentCard : groupStyle.receivedCard
      ]}
    >
      <View style={groupStyle.cardContent}>

        {/* //Assignment Title + icon */}
        <View style={[groupStyle.cardRow, { marginBottom: height * 0.01, }]}>
          <MaterialIcons name="assignment" size={20} color={isSentByUser ? '#fff' : '#694df0'} />
          <Text style={[groupStyle.cardTitle, { marginLeft: 5, fontSize: 20 }, isSentByUser && { color: '#fff' }]}>Assignment</Text>
        </View>
        <Text style={[groupStyle.cardTitle, { marginBottom: height * 0.01 }, isSentByUser && { color: '#fff' }]}>{title}</Text>

        <View style={[groupStyle.cardRow, { marginBottom: height * 0.01 }]}>
          <Ionicons name="calendar-outline" size={16} color={isSentByUser ? '#fff' : '#694df0'} />
          <Text style={[groupStyle.cardText, isSentByUser && { color: '#eee' }]}>{formattedDate}</Text>
        </View>

        <View style={[groupStyle.cardRow]}>
          <MaterialIcons name="pending-actions" size={16} color={isSentByUser ? '#fff' : '#694df0'} />
          <Text style={[groupStyle.cardText, isSentByUser && { color: '#eee' }]}>Pending</Text>

          <Text style={[groupStyle.messageTime, isSentByUser && { color: '#ccc' }]}>
            {time}
          </Text>
        </View>

      </View>
    </TouchableOpacity>
  );
};

export default AssignmentCard;