import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { groupStyle } from '@/Styles/groupStyle';
const { width, height } = Dimensions.get('window');
const SplitExpenseCard = ({
    title = "Dinner at Fancy Restaurant",
    date = "2025-09-02",
    amount = 350,
    category = "Food",
    paidBy = "Sarah Johnson",
    splitWith = [
        { name: "Michael", initials: "MC", status: "Paid" },
        { name: "David", initials: "DW", status: "Paid" },
        { name: "Emily", initials: "ED", status: "Unpaid" }
    ],
    onPress,
    isSentByUser = false,
    time
}) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US');
    const perPerson = Math.round(amount / (splitWith.length + 1)); // Including payer

    return (
        <TouchableOpacity
            style={[
                groupStyle.card,
                isSentByUser ? groupStyle.sentCard : groupStyle.receivedCard
            ]}
            onPress={onPress}
        >
            <View style={groupStyle.cardContent}>
                <View style={[groupStyle.cardRow]}>
                    <MaterialIcons
                        name="paid"
                        size={20}
                        color={isSentByUser ? '#fff' : '#694df0'}
                    />
                    <Text style={[
                        groupStyle.cardTitle,
                        { marginLeft: 5, fontSize: 20 },
                        isSentByUser ? { color: '#fff' } : { color: 'black' }
                    ]}>
                        Split Expense
                    </Text>
                </View>

                <View style={styles.rowBetween}>
                    <Text style={[
                        styles.title,
                        isSentByUser && { color: '#fff' }
                    ]}>
                        {title}
                    </Text>
                    <Text style={[
                        styles.amount,
                        isSentByUser && { color: '#fff' }
                    ]}>
                        ${amount}
                    </Text>
                </View>

                <View style={styles.rowBetween}>
                    <View style={styles.row}>
                        <Ionicons
                            name="calendar-outline"
                            size={14}
                            color={isSentByUser ? '#ccc' : '#555'}
                        />
                        <Text style={[
                            styles.dateText,
                            isSentByUser && { color: '#eee' }
                        ]}>
                            {formattedDate}
                        </Text>

                    </View>
                    <Text style={[
                        styles.paidBy,
                        isSentByUser && { color: '#eee' }
                    ]}>
                        Paid by {paidBy}
                    </Text>
                </View>


                {/* Category is commented */}
                {/* <View style={[
                            styles.badge,
                            isSentByUser && { backgroundColor: 'rgba(255,255,255,0.2)' }
                        ]}>
                            <Text style={[
                                styles.badgeText,
                                isSentByUser && { color: '#fff' }
                            ]}>
                                {category}
                            </Text>
                        </View> */}

                <View style={{
                    width: width * 0.65,
                    height: 1,
                    backgroundColor: isSentByUser ? 'rgba(255,255,255,0.3)' : 'grey',
                    marginVertical: height * 0.01
                }} />

                <View style={styles.rowBetween}>
                    <Text style={[
                        styles.splitText,
                        isSentByUser && { color: '#eee' }
                    ]}>
                        Split with
                    </Text>
                    <Text style={[
                        styles.perPerson,
                        isSentByUser && { color: '#eee' }
                    ]}>
                        ${perPerson} each
                    </Text>
                </View>
                <View style={styles.avatarRow}>
                    {splitWith.slice(0, 3).map((user, index) => (
                        <View key={index} style={styles.userItem}>
                            <View
                                style={[
                                    styles.avatar,
                                    {
                                        backgroundColor: user.status === "Paid"
                                            ? (isSentByUser ? 'rgba(223, 251, 230, 0.7)' : '#DFFBE6')
                                            : (isSentByUser ? 'rgba(238, 238, 238, 0.5)' : '#eee'),
                                    },
                                ]}
                            >
                                {user.pic ? (
                                    <Image
                                        source={{ uri: user.pic }}
                                        style={{ width: 36, height: 36, borderRadius: 18 }}
                                    />
                                ) : (
                                    <Text
                                        style={[
                                            styles.avatarText,
                                            {
                                                color: user.status === "Paid"
                                                    ? (isSentByUser ? '#fff' : '#2ecc71')
                                                    : (isSentByUser ? '#eee' : '#888'),
                                            },
                                        ]}
                                    >
                                        {user.initials || user.name?.charAt(0)}
                                    </Text>
                                )}
                            </View>
                            <Text numberOfLines={1} style={[
                                styles.nameText,
                                isSentByUser && { color: '#eee' }
                            ]}>
                                {user.name}
                            </Text>
                            <Text style={[
                                styles.statusText,
                                {
                                    color: user.status === "Paid"
                                        ? (isSentByUser ? '#a7f3d0' : '#2ecc71')
                                        : (isSentByUser ? '#ff9e9e' : '#ff5252')
                                }
                            ]}>
                                {user.status}
                            </Text>
                        </View>
                    ))}

                    {/* +N More */}
                    {splitWith.length > 3 && (
                        <View style={styles.userItem}>
                            <View
                                style={[
                                    styles.avatar,
                                    {
                                        backgroundColor: isSentByUser ? 'rgba(255,255,255,0.3)' : '#ccc',
                                    },
                                ]}
                            >
                                <Text style={[
                                    styles.avatarText,
                                    { color: isSentByUser ? '#fff' : '#333', fontSize: 13 }
                                ]}>
                                    +{splitWith.length - 3}
                                </Text>
                            </View>
                            <Text numberOfLines={1} style={[
                                styles.nameText,
                                isSentByUser && { color: '#eee' }
                            ]}>
                                More
                            </Text>

                        </View>
                    )}
                </View>

            </View>
            <Text style={[groupStyle.messageTime, isSentByUser && { color: '#ccc' }]}>
                {time}
            </Text>
        </TouchableOpacity>
    );
};

export default SplitExpenseCard;

const styles = StyleSheet.create({
    // card: {
    //     backgroundColor: 'white',
    //     borderRadius: 12,
    //     padding: 16,
    //     width: width * 0.9,
    //     alignSelf: 'center',
    //     shadowColor: '#000',
    //     shadowOpacity: 0.05,
    //     shadowRadius: 4,
    //     shadowOffset: { width: 0, height: 2 },
    //     elevation: 2,
    //     marginVertical: 10,
    // },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: height * 0.008,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
    },
    amount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
    },
    dateText: {
        fontSize: 13,
        color: '#555',
    },
    badge: {
        backgroundColor: '#fdecc8',
        width: width * 0.15,
        height: height * 0.03,
        justifyContent: 'center',
        alignItems: 'center',

        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: height * 0.02 / 2,
        marginVertical: height * 0.009,
    },
    badgeText: {
        fontSize: 12,
        color: '#d69e2e',
        fontWeight: '500',
    },
    paidBy: {
        fontSize: 12,
        color: '#555',
    },
    splitText: {
        fontSize: 13,
        color: '#333',
        fontWeight: '600',
        marginTop: 6,
    },
    perPerson: {
        fontSize: 13,
        color: '#555',
        marginTop: 6,
    },
    avatarRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: width * 0.02,
        marginTop: 12,
    },
    userItem: {
        alignItems: 'center',
        width: 60,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontWeight: '600',
    },
    nameText: {
        fontSize: 12,
        color: '#333',
        marginTop: 4,
        textAlign: 'center',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '500',
        marginTop: 2,
    },
});
