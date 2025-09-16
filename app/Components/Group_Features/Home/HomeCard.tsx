import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
} from '@expo/vector-icons';
import { groupStyle } from '@/Styles/groupStyle';
import Groups from '@/app/(tabs)/groups';

const { width, height } = Dimensions.get('window');

interface TaskCardProps {
  type: 'shopping' | 'chores' | 'reminder' | 'budget';
  title: string;
  subText?: string;
  date?: string;
  user?: string;
  completed?: boolean;
  onToggleCompleted?: () => void;
  amount?: string;
  budgetType?: 'income' | 'expense';
  time?: string;
  isSentByUser?: boolean;
}

const HomeCard: React.FC<TaskCardProps> = ({
  type,
  title,
  subText,
  date,
  user,
  completed,
  onToggleCompleted,
  amount,
  budgetType,
  time,
  isSentByUser = false,
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'shopping':
        return <MaterialCommunityIcons name="cart-outline" size={20} color={isSentByUser ? '#fff' : '#694df0'} />;
      case 'chores':
        return <Feather name="check-square" size={20} color={isSentByUser ? '#fff' : '#694df0'} />;
      case 'reminder':
        return <Ionicons name="notifications-outline" size={20} color={isSentByUser ? '#fff' : '#694df0'} />;
      case 'budget':
        return <MaterialCommunityIcons name="cash" size={20} color={isSentByUser ? '#fff' : '#694df0'} />;
      default:
        return null;
    }
  };

  const getTypeTitle = () => {
    switch (type) {
      case 'shopping':
        return 'Shopping';
      case 'chores':
        return 'Chores';
      case 'reminder':
        return 'Reminder';
      case 'budget':
        return 'Budget';
      default:
        return 'Task';
    }
  };

  const getLeftIcon = () => {
    if (type === 'chores') {
      return (
        <TouchableOpacity onPress={onToggleCompleted}>
          <Ionicons
            name={completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={20}
            color={isSentByUser ? '#fff' : '#694df0'}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      );
    }
   
    return null;
  };

  const cardBackground = isSentByUser ? styles.sentCard : styles.receivedCard;

  return (
    <View style={[styles.card, cardBackground]}>
      {/* Icon + Title Row */}
      <View style={[groupStyle.row, { marginBottom: height * 0.01 }]}>
        {getTypeIcon()}
        <Text style={[styles.title, { marginLeft: 5, fontSize: 20 }, isSentByUser && { color: '#fff' }]}>
          {getTypeTitle()}
        </Text>
      </View>

      {/* Budget Card */}
      {type === 'budget' ? (
        <>
          <View style={styles.rowBetween}>
            <Text style={[groupStyle.title, isSentByUser && { color: '#fff' }]}>{title}</Text>
            <Text
              style={[
                styles.amountText,
                { color: budgetType === 'income' ? '#00A86B' : '#FF5A5F' },
              ]}
            >
              {budgetType === 'income' ? '+' : '-'}₹{amount}
            </Text>
          </View>
          <View style={[groupStyle.row, { alignItems: 'center', justifyContent: 'space-between', marginTop: height * 0.01 }]}>
            {/* Left Section: Icon and Text Info */}
            <View style={[styles.leftSection, {}]}>
              <View
                style={[
                  styles.budgetIconCircle,
                  {
                    backgroundColor: budgetType === 'income' ? '#D1FAE5' : '#FEE2E2',
                  },
                ]}
              >
                <Ionicons
                  name={budgetType === 'income' ? 'arrow-up' : 'arrow-down'}
                  size={20}
                  color={budgetType === 'income' ? '#00A86B' : '#EF4444'}
                />
              </View>

              <View >
                <Text
                  style={[

                    isSentByUser && { color: '#eee' },
                  ]}
                >
                  {subText}
                </Text>

              </View>
            </View>


          </View>


        </>
      ) : (
        <>
          {/* Other Types */}
          <View style={styles.row}>
            {getLeftIcon()}
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, completed && styles.completedText, isSentByUser && { color: '#fff' }]}>
                {title}
              </Text>

              {type === 'shopping' && subText && (
                <Text style={[styles.subText, isSentByUser && { color: '#eee' }]}>Quantity: {subText}</Text>
              )}

              {type === 'chores' && (
                <>

                  <View style={[styles.subRow, { marginTop: height * 0.01 }]}>
                    <Text style={[{ fontSize: 14 }, isSentByUser && { color: '#eee' }]}>Assigned To: {user}</Text>


                  </View>
                  <View style={[groupStyle.row, { marginTop: height * 0.01 }]}>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={18}
                      color={isSentByUser ? '#eee' : '#808080'}
                      style={{marginRight: width * 0.02}}
                    />
                    <Text style={[styles.dateText, isSentByUser && { color: '#eee' }]}>
                      {date ? date : 'No due date'}
                    </Text>
                  </View>

                </>
              )}

              {type === 'reminder' && (
                <>
                 
                   <View style={[groupStyle.row, { marginTop: height * 0.01 }]}>
                    <MaterialCommunityIcons
                      name="calendar"
                       size={18}
                      color={isSentByUser ? '#eee' : '#808080'}
                    />
                    <Text style={[styles.reminderInfoText, isSentByUser && { color: '#eee' }]}> {date} </Text>
                  </View>
                  
                </>
              )}
            </View>
          </View>
        </>
      )}

      {/* Time */}
      {time && (
        <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
          <Text style={[groupStyle.messageTime, isSentByUser && { color: '#ccc' }]}>{time}</Text>
        </View>
      )}
    </View>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  card: {
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
    marginRight: width * 0.01,
  },
  receivedCard: {
    backgroundColor: '#e4e6eb',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  subText: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  choresSubText: {
    fontSize: 14,
    color: '#808080',
    marginLeft: 6,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  budgetIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderLabel: {
    backgroundColor: '#E6E9FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  reminderLabelText: {
    color: '#4D5DFA',
    fontSize: 10,
  },
  reminderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  reminderInfoText: {
    fontSize: 11,
    color: '#808080',
    marginLeft: 4,
  },
  reminderDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#694df0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    alignSelf: 'center',
  },
  reminderDotText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: -1,
  },
});
