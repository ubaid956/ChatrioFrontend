// import React from 'react';
// import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');

// const ItineraryCard = ({ title, description, startDate, endDate, route }) => {
//   return (
//     <TouchableOpacity style={styles.container}>
//       {/* Title and Description */}
//       <Text style={styles.title}>{title}</Text>
//       <Text style={styles.description}>{description}</Text>

//       {/* Dates */}
//       <View style={styles.dateRow}>
//         <Ionicons name="calendar-outline" size={16} color="#fff" />
//         <Text style={styles.dateText}>
//           {'  '}
//           {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//           {' - '}
//           {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//         </Text>
//       </View>

//       {/* Route Box */}
//       <View style={styles.routeBox}>
//         <View style={styles.routeTop}>
//           <View style={styles.iconLabel}>
//             <Ionicons name="airplane-outline" size={16} color="#22c55e" />
//             <Text style={styles.routeLabel}>Start</Text>
//           </View>
//           <View style={styles.dashLine} />
//           <View style={styles.iconLabel}>
//             <Ionicons name="airplane-outline" size={16} color="#ef4444" />
//             <Text style={styles.routeLabel}>End</Text>
//           </View>
//         </View>

//         {/* Route Text */}
//         <Text style={styles.routeText}>{route}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default ItineraryCard;

// const styles = StyleSheet.create({
//   container: {
//     width: width * 0.9,
//     backgroundColor: '#3b82f6',
//     alignSelf: 'center',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 20,
//   },
//   title: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   description: {
//     color: '#e0e7ff',
//     fontSize: 15,
//     marginTop: 4,
//   },
//   dateRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   dateText: {
//     color: '#fff',
//     fontSize: 14,
//   },
//   routeBox: {
//     marginTop: 14,
//     backgroundColor: '#2563eb',
//     padding: 12,
//     borderRadius: 12,
//   },
//   routeTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   iconLabel: {
//     alignItems: 'center',
//   },
//   routeLabel: {
//     color: '#fff',
//     fontSize: 12,
//     marginTop: 2,
//   },
//   dashLine: {
//     borderBottomWidth: 1,
//     borderStyle: 'dashed',
//     borderColor: '#ccc',
//     width: width * 0.5,
//   },
//   routeText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 6,
//   },
// });

import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { groupStyle } from '@/Styles/groupStyle';
const { width, height } = Dimensions.get('window');

// const ItineraryCard = ({ title, description, startDate, endDate, route, onPress }) => {
//   return (
//     <TouchableOpacity style={[groupStyle.card]} onPress={onPress}>
//       {/* Title and Description */}

//       <View style={groupStyle.content}>
//         <View style={[groupStyle.cardRow]}>
//           <MaterialIcons name="assignment" size={20} color={'#694df0'} />
//           <Text style={[groupStyle.cardTitle, { marginLeft: 5, fontSize: 20 }, { color: 'black' }]}>Itinerary</Text>
//         </View>

//         <Text style={[groupStyle.cardTitle, {marginBottom: height*0.008}]}>{title}</Text>
//         <Text style={[groupStyle.cardText, {marginBottom: height*0.008}]}>{description}</Text>

//         {/* Dates */}
//         <View style={[groupStyle.cardRow]}>
//           <Ionicons name="calendar-outline" size={20} color="#694df0" />
//           <Text style={styles.dateText}>
//             {' '}
//             {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//             {' - '}
//             {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//           </Text>
//         </View>

//         {/* Route Box */}
//         <View style={styles.routeBox}>
//           <View style={styles.routeHeader}>
//             <View style={styles.iconLabel}>
//               <Ionicons name="airplane-outline" size={16} color="#22c55e" />
//               <Text style={styles.routeLabel}>Start</Text>
//             </View>
//             <View style={styles.dashedLine} />
//             <View style={styles.iconLabel}>
//               <Ionicons name="airplane-outline" size={16} color="#ef4444" />
//               <Text style={styles.routeLabel}>End</Text>
//             </View>
//           </View>
//           <Text style={styles.routeText}>{route}</Text>
//         </View>

//       </View>

//     </TouchableOpacity>
//   );
// };

const ItineraryCard = ({ title, description, startDate, endDate, route, onPress, isSentByUser = false, time }) => {
  return (
    <TouchableOpacity 
      style={[groupStyle.card, isSentByUser ? groupStyle.sentCard : groupStyle.receivedCard]} 
      onPress={onPress}
    >
      {/* Title and Description */}

      <View style={groupStyle.content}>
        <View style={[groupStyle.cardRow]}>
          <MaterialIcons 
            name="assignment" 
            size={20} 
            color={isSentByUser ? '#fff' : '#694df0'} 
          />
          <Text style={[
            groupStyle.cardTitle, 
            { marginLeft: 5, fontSize: 20 }, 
            isSentByUser ? { color: '#fff' } : { color: 'black' }
          ]}>
            Itinerary
          </Text>
        </View>

        <Text style={[
          groupStyle.cardTitle, 
          {marginBottom: height*0.008}, 
          isSentByUser && { color: '#fff' }
        ]}>
          {title}
        </Text>
        <Text style={[
          groupStyle.cardText, 
          {marginBottom: height*0.008}, 
          isSentByUser && { color: '#eee' }
        ]}>
          {description}
        </Text>

        {/* Dates */}
        <View style={[groupStyle.cardRow]}>
          <Ionicons 
            name="calendar-outline" 
            size={20} 
            color={isSentByUser ? '#fff' : '#694df0'} 
          />
          <Text style={[
            styles.dateText, 
            isSentByUser && { color: '#eee' }
          ]}>
            {' '}
            {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            {' - '}
            {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>

        {/* Route Box */}
        <View style={styles.routeBox}>
          <View style={styles.routeHeader}>
            <View style={styles.iconLabel}>
              <Ionicons 
                name="airplane-outline" 
                size={16} 
                color={isSentByUser ? '#22c55e' : '#22c55e'} 
              />
              <Text style={[
                styles.routeLabel, 
                isSentByUser && { color: 'black' }
              ]}>
                Start
              </Text>
            </View>
            <View style={[
              styles.dashedLine, 
              isSentByUser && { borderColor: '#ccc' }
            ]} />
            <View style={styles.iconLabel}>
              <Ionicons 
                name="airplane-outline" 
                size={16} 
                color={isSentByUser ? '#fca5a5' : '#ef4444'} 
              />
              <Text style={[
                styles.routeLabel, 
                isSentByUser && { color: 'black' }
              ]}>
                End
              </Text>
            </View>
          </View>
          <Text style={[
            styles.routeText, 
            isSentByUser && { color: 'black' }
          ]}>
            {route}
          </Text>
        </View>
      </View>
       <Text style={[groupStyle.messageTime, isSentByUser && { color: '#ccc' }]}>
            {time}
      </Text>
    </TouchableOpacity>
  );
};



export default ItineraryCard;
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: width * 0.9,
    alignSelf: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#111',
    marginBottom: 4,
  },
  description: {
    color: '#555',
    fontSize: 14,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    color: '#694df0',
    fontSize: 13,
    marginLeft: 6,
  },
  routeBox: {
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconLabel: {
    alignItems: 'center',
    width: 50,
  },
  routeLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    width: width * 0.35,
  },
  routeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: height * 0.01, // Adjusted for better spacing
  },
});
