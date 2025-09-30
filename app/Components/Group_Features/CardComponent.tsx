
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import { groupStyle } from '@/Styles/groupStyle';

const screenWidth = Dimensions.get('window').width;
const { height, width } = Dimensions.get('window')

const getStatusStyles = (status, isSentByUser) => {
  if (isSentByUser) {
    return {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: '#fff'
    };
  }

  switch (status) {
    case 'To Do':
      return { backgroundColor: '#fcd34d', color: '#92400e' };
    case 'In Progress':
      return { backgroundColor: '#bfdbfe', color: '#1e3a8a' };
    case 'Done':
      return { backgroundColor: '#bbf7d0', color: '#065f46' };
    default:
      return { backgroundColor: '#e5e7eb', color: '#374151' };
  }
};

const CardComponent = ({
  isTask,
  title,
  dueDate,
  time,
  assignee,
  status,
  platform,
  duration,
  participants = [],
  onJoin,
  isSentByUser = false,
  description, msgTime
}) => {
  const statusStyle = getStatusStyles(status, isSentByUser);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        groupStyle.card,
        isSentByUser ? groupStyle.sentCard : groupStyle.receivedCard
      ]}
    >
      <View style={groupStyle.cardContent}>
        <View style={[groupStyle.cardRow, { marginBottom: height * 0.01 }]}>
          <Ionicons
            name="calendar"
            size={20}
            color={isSentByUser ? '#fff' : '#694df0'}
          />
          <Text style={[
            groupStyle.cardTitle,
            { marginLeft: 5, fontSize: 20 },
            isSentByUser && { color: '#fff' }
          ]}>
            {isTask ? 'Task' : 'Meeting'}
          </Text>
        </View>

        <View style={[
          groupStyle.row,
          {
            justifyContent: 'space-between',
            marginBottom: height * 0.01,
          }
        ]}>
          <Text style={[
            groupStyle.cardTitle,
            isSentByUser && { color: '#fff' }
          ]}>
            {title}
          </Text>
          {isTask ? (
            <View style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.backgroundColor },
            ]}>
              <Text style={[
                styles.statusText,
                { color: statusStyle.color }
              ]}>
                {status}
              </Text>
            </View>
          ) : (
            <View style={[
              styles.durationBadge,
              isSentByUser && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
            ]}>
              <Text style={[
                styles.durationText,
                isSentByUser && { color: '#fff' }
              ]}>
                {duration}
              </Text>
            </View>
          )}
        </View>

        <Text style={[
          groupStyle.cardText,
          { marginBottom: height * 0.01 },
          isSentByUser && { color: '#eee' }
        ]}>
          {description}
        </Text>

        <View style={styles.detailRow}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={isSentByUser ? '#fff' : '#694df0'}
          />
          <Text style={[
            groupStyle.cardText,
            isSentByUser && { color: '#eee', marginHorizontal: width * 0.01 }
          ]}>
            {dueDate} {time ? `• ${time}` : ''}
          </Text>
        </View>

        {isTask ? (
          <View style={styles.detailRow}>
            <Ionicons
              name="person-outline"
              size={16}
              color={isSentByUser ? '#fff' : '#694df0'}
            />
            <Text style={[
              groupStyle.cardText,
              isSentByUser && { color: '#eee' }

            ]}>
              {assignee}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.detailRow}>
              <Entypo
                name="video"
                size={16}
                color={isSentByUser ? '#fff' : '#694df0'}
              />
              <Text style={[
                groupStyle.cardText,
                isSentByUser && { color: '#eee', marginHorizontal: width * 0.01 }
              ]}>
                {platform}
              </Text>
            </View>
            <View style={styles.participantRow}>
              {participants.map((p, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.participantBubble,
                    isSentByUser && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                  ]}
                >
                  <Text style={[
                    styles.participantText,
                    isSentByUser && { color: '#fff' }
                  ]}>
                    {p}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[
                styles.joinBtn,
                isSentByUser && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
              ]}
              onPress={onJoin}
            >
              <Text style={[
                styles.joinText,
                isSentByUser && { color: '#fff' }
              ]}>
                Join
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <Text style={[groupStyle.messageTime, isSentByUser && { color: '#ccc' }]}>
        {time}
      </Text>
    </TouchableOpacity>
  );
};

export default CardComponent;

const styles = StyleSheet.create({
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: {
    fontSize: screenWidth < 360 ? 10 : 12,
    fontWeight: '600',
  },
  durationBadge: {
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  durationText: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginRight: 10
  },
  participantRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  participantBubble: {
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  participantText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#111827',
  },
  joinBtn: {
    backgroundColor: '#5b21b6',
    marginTop: 10,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
  },
  joinText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});