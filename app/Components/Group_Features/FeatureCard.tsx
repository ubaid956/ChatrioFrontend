

import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { groupStyle } from '@/Styles/groupStyle';

const { height } = Dimensions.get('window');

const FeatureCard = ({
  title,
  description,
  isSentByUser = false,
  time,
  type = 'note' // 'note' or 'idea'
}) => {
  const iconColor = isSentByUser ? '#fff' : '#694df0';
  const isNote = type === 'note';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        groupStyle.card,
        isSentByUser ? groupStyle.sentCard : groupStyle.receivedCard
      ]}
    >
      <View style={groupStyle.cardContent}>
        {/* Title Icon and Label */}
        <View style={[groupStyle.cardRow, { marginBottom: height * 0.01 }]}>
          {isNote ? (
            <MaterialIcons name="note" size={20} color={iconColor} />
          ) : (
            <Ionicons name="bulb-outline" size={20} color={iconColor} />
          )}
          <Text
            style={[
              groupStyle.cardTitle,
              { marginLeft: 5, fontSize: 20 },
              isSentByUser && { color: '#fff' }
            ]}
          >
            {isNote ? 'Note' : 'Idea'}
          </Text>
        </View>

        {/* Title Text */}
        <Text
          style={[
            groupStyle.cardTitle,
            { marginBottom: height * 0.01 },
            isSentByUser && { color: '#fff' }
          ]}
        >
          {title}
        </Text>

        {/* Description and Time */}
        <View style={[groupStyle.cardRow]}>
          <Text style={[groupStyle.cardText, isSentByUser && { color: '#eee' }]}>
            {description}
          </Text>

        
        </View>
      </View>
        <Text style={[groupStyle.messageTime, isSentByUser && { color: '#ccc' }]}>
            {time}
          </Text>
    </TouchableOpacity>
  );
};

export default FeatureCard;
