// // components/Group_Components/IdeaItem.js
// import React from 'react';
// import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

// const IdeaItem = ({ idea, isSentByUser }) => {
//   const { width } = useWindowDimensions();
//   const containerWidth = width * 0.78;

//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         justifyContent: isSentByUser ? 'flex-end' : 'flex-start',
//         marginVertical: 6,
//         paddingHorizontal: 10,
//       }}
//     >
//       <View
//         style={[
//           styles.ideaContainer,
//           { maxWidth: containerWidth },
//           isSentByUser ? styles.sent : styles.received,
//         ]}
//       >
//         {!isSentByUser && (
//           <Text style={[styles.ideaSender, styles.textDark]}>
//             {idea.senderName}
//           </Text>
//         )}

//         <Text style={[styles.ideaContent, isSentByUser ? styles.textWhite : styles.textDark]}>
//           💡 {idea.content}
//         </Text>

//         <Text style={[styles.timeText, isSentByUser ? styles.textMuted : styles.textLightDark]}>
//           {new Date(idea.createdAt).toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           })}
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   ideaContainer: {
//     padding: 14,
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sent: {
//     backgroundColor: '#00b894',
//     borderTopLeftRadius: 16,
//     borderBottomLeftRadius: 16,
//   },
//   received: {
//     backgroundColor: '#dfe6e9',
//     borderTopRightRadius: 16,
//     borderBottomRightRadius: 16,
//   },
//   ideaSender: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     marginBottom: 6,
//   },
//   ideaContent: {
//     fontSize: 16,
//     fontWeight: '600',
//     lineHeight: 22,
//   },
//   timeText: {
//     fontSize: 10,
//     marginTop: 8,
//     alignSelf: 'flex-end',
//   },

//   // Colors
//   textWhite: { color: '#fff' },
//   textMuted: { color: 'black' },
//   textDark: { color: '#111' },
//   textLightDark: { color: '#555' },
// });

// export default IdeaItem;



// // Idea Card Component

// import React from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';

// const screenWidth = Dimensions.get('window').width;

// const getBackgroundColor = (variant) => {
//   switch (variant) {
//     case 1:
//       return '#DBEAFE'; // blue
//     case 2:
//       return '#F3E8FF'; // purple
//     case 3:
//       return '#DCFCE7'; // green
//     default:
//       return '#F9FAFB'; // fallback
//   }
// };

// const FeatureCard = ({ title, description, variant = 1 }) => {
//   const bgColor = getBackgroundColor(variant);

//   return (
//     <View style={[styles.card, { backgroundColor: bgColor }]}>
//       <Text style={styles.title} numberOfLines={1}>{title}</Text>
//       <Text style={styles.description} numberOfLines={2}>{description}</Text>
//     </View>
//   );
// };

// export default FeatureCard;
// const styles = StyleSheet.create({
//   card: {
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginBottom: 12,
//     width: '48%', // Fits two cards in a row
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 14,
//     color: '#111827',
//     marginBottom: 4,
//   },
//   description: {
//     fontSize: 13,
//     color: '#374151',
//   },
// });

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
