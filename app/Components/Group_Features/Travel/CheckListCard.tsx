import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { groupStyle } from '@/Styles/groupStyle';

const { height, width } = Dimensions.get('window');

// const CheckListCard = ({ title = "Europe Trip", startDate, endDate, totalItems = 18, packedItems = 2, onPress }) => {
//     const formattedStart = new Date(startDate).toLocaleDateString('en-US', {
//         month: 'short',
//         day: '2-digit',
//         year: 'numeric',
//     });

//     const formattedEnd = new Date(endDate).toLocaleDateString('en-US', {
//         month: 'short',
//         day: '2-digit',
//         year: 'numeric',
//     });

//     const percentage = Math.round((packedItems / totalItems) * 100);

//     return (
//         <TouchableOpacity style={groupStyle.card} onPress={onPress}>

//             <View style={styles.content}>
//                 <View style={[groupStyle.cardRow,]}>
//                     <MaterialIcons name="assignment" size={20} color={'#694df0'} />
//                     <Text style={[groupStyle.cardTitle, { marginLeft: 5, fontSize: 20, backgroundColor: 'green' }, { color: '#fff' }]}>CheckList</Text>
//                 </View>

//                 <Text style={[groupStyle.cardTitle, {marginBottom: height*0.008}]}>{title}</Text>

//                 <View style={styles.row}>
//                     <Ionicons name="calendar-outline" size={16} color="#694df0" />
//                     <Text style={styles.text}>{formattedStart} - {formattedEnd}</Text>
//                 </View>

//                 <View style={styles.progressBarBackground}>
//                     <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
//                 </View>

//                 <View style={styles.rowBetween}>
//                     <Text style={styles.subText}>{packedItems} of {totalItems} packed</Text>
//                     <Text style={styles.subText}>{percentage}% complete</Text>
//                 </View>
//             </View>
//         </TouchableOpacity>
//     );
// };

const CheckListCard = ({ 
    title = "Europe Trip", 
    startDate, 
    endDate, 
    totalItems = 18, 
    packedItems = 2, 
    onPress, 
    isSentByUser = false ,
    time
}) => {
    const formattedStart = new Date(startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });

    const formattedEnd = new Date(endDate).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });

    const percentage = Math.round((packedItems / totalItems) * 100);

    return (
        <TouchableOpacity 
            style={[
                groupStyle.card, 
                isSentByUser ? groupStyle.sentCard : groupStyle.receivedCard
            ]} 
            onPress={onPress}
        >
            <View style={styles.content}>
                <View style={[groupStyle.cardRow]}>
                    <MaterialIcons 
                        name="assignment" 
                        size={20} 
                        color={isSentByUser ? '#fff' : '#694df0'} 
                    />
                    <Text style={[
                        groupStyle.cardTitle, 
                        { marginLeft: 5, fontSize: 20 }, 
                        isSentByUser ? { color: '#fff' } : { color: 'black'}
                    ]}>
                        CheckList
                    </Text>
                </View>

                <Text style={[
                    groupStyle.cardTitle, 
                    {marginBottom: height*0.008}, 
                    isSentByUser && { color: '#fff' }
                ]}>
                    {title}
                </Text>

                <View style={styles.row}>
                    <Ionicons 
                        name="calendar-outline" 
                        size={16} 
                        color={isSentByUser ? '#fff' : '#694df0'} 
                    />
                    <Text style={[
                        styles.text, 
                        isSentByUser && { color: '#eee' }
                    ]}>
                        {formattedStart} - {formattedEnd}
                    </Text>
                </View>

                <View style={[
                    styles.progressBarBackground,
                    isSentByUser && { backgroundColor: 'rgba(255,255,255,0.3)' }
                ]}>
                    <View style={[
                        styles.progressBarFill, 
                        { width: `${percentage}%` },
                        isSentByUser && { backgroundColor: '#fff' }
                    ]} />
                </View>

                <View style={styles.rowBetween}>
                    <Text style={[
                        styles.subText, 
                        isSentByUser && { color: '#eee' }
                    ]}>
                        {packedItems} of {totalItems} packed
                    </Text>
                    <Text style={[
                        styles.subText, 
                        isSentByUser && { color: '#eee' }
                    ]}>
                        {percentage}% complete
                    </Text>
                </View>
            </View>
             <Text style={[groupStyle.messageTime, isSentByUser && { color: '#ccc' }]}>
            {time}
          </Text>
        </TouchableOpacity>
    );
};
export default CheckListCard;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        width: width * 0.9,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        marginVertical: 8,
    },
    leftStrip: {
        width: 4,
        backgroundColor: '#694df0',
        borderRadius: 10,
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontWeight: '700',
        fontSize: 16,
        color: '#111',
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    text: {
        marginLeft: 6,
        color: '#555',
        fontSize: 13,
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: '#eee',
        borderRadius: 5,
        overflow: 'hidden',
        marginVertical: 6,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#694df0',
        borderRadius: 5,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    subText: {
        fontSize: 12,
        color: '#555',
        fontWeight: '500',
    },
});
