// import React from 'react';
// import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');

// const QuizCard = ({ 
//   title = "Algebra Fundamentals",
//   category = "Mathematics",
//   questions = 15,
//   time = "20 min",
//   score = 85,
//   onPress = () => {}
// }) => {
//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
//       <View style={styles.topRow}>
//         <Text style={styles.title}>{title}</Text>
//         <Text style={styles.score}>{score}%</Text>
//       </View>

//       <View style={styles.bottomRow}>
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>{category}</Text>
//         </View>

//         <View style={styles.row}>
//           <Ionicons name="help-circle-outline" size={14} color="#666" />
//           <Text style={styles.infoText}>{questions} questions</Text>
//         </View>

//         <View style={styles.row}>
//           <Ionicons name="time-outline" size={14} color="#666" />
//           <Text style={styles.infoText}>{time}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default QuizCard;

// const styles = StyleSheet.create({
//   card: {
//     width: width * 0.9,
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     alignSelf: 'center',
//     marginVertical: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   topRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#111',
//   },
//   score: {
//     color: 'green',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   bottomRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//   },
//   badge: {
//     backgroundColor: '#eef2ff',
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//     marginRight: 8,
//   },
//   badgeText: {
//     color: '#4f46e5',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   infoText: {
//     marginLeft: 4,
//     fontSize: 12,
//     color: '#555',
//   },
// });

import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import CustomButton from '../../CustomButton';
import { groupStyle } from '@/Styles/groupStyle';

const { width, height } = Dimensions.get('window');

const QuizCard = ({
  title = "Algebra Fundamentals",
  category = "Mathematics",
  questions = 15,
  time = "20 min",
  score = 85,
  isSentByUser = false,


  onPress = () => { }
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSentByUser ? styles.sentCard : styles.receivedCard
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.row, { marginBottom: height * 0.01, }]}>
        <MaterialIcons name="quiz" size={20}  color={isSentByUser ? '#fff' : '#694df0'}/>
        <Text style={[styles.title, { marginLeft: 5, fontSize: 20 }, isSentByUser && { color: '#fff' }]}>Quiz</Text>
      </View>
      <View style={styles.topRow}>
        <Text style={[styles.title, isSentByUser && { color: '#fff' }]}>{title}</Text>
        <Text style={[styles.score, isSentByUser && { color: '#a5d6a7' }]}>{score}%</Text>
      </View>

      <View style={styles.bottomRow}>
        <View style={[
          styles.badge,
          isSentByUser && { backgroundColor: 'rgba(255,255,255,0.2)' }
        ]}>
          <Text style={[
            styles.badgeText,
            isSentByUser && { color: '#fff' }
          ]}>{category}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="help-circle-outline" size={14} color={isSentByUser ? '#ddd' : '#666'} />
          <Text style={[styles.infoText, isSentByUser && { color: '#ddd' }]}>{questions} questions</Text>
        </View>

        
      </View>

      <View style={[styles.row, { marginTop: height * 0.02 }]}>
        <CustomButton title={"Start Quiz"} extraSmall={true} />
         <Text style={[groupStyle.messageTime, isSentByUser && { color: '#ccc' }]}>
                                {time}
                            </Text>
      </View>


    </TouchableOpacity>
  );
};

export default QuizCard;

const styles = StyleSheet.create({
  card: {
    width: width * 0.75,
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sentCard: {
    backgroundColor: '#694df0',
  },
  receivedCard: {
    backgroundColor: '#e4e6eb',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    // backgroundColor:'red',


  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  score: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#eef2ff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  badgeText: {
    color: '#4f46e5',
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#555',
  },
});