

import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const StudyEventCard = ({
    title,
    date,
    location = 'Room 201',
    type = 'Assignment',
    isSentByUser = false
}) => {
    const eventDate = new Date(date);
    const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const endTime = new Date(eventDate.getTime() + 90 * 60000); // Add 90 mins
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });

    return (
        <View style={[
            styles.card,
            isSentByUser ? styles.sentCard : styles.receivedCard
        ]}>

            <View style={[styles.row, { marginBottom: height * 0.01, }]}>
                <MaterialIcons
                    name="event"
                    size={20}
                    color={isSentByUser ? '#fff' : '#694df0'}
                />

                <Text style={[styles.title, { marginLeft: 5, fontSize: 20 }, isSentByUser && { color: '#fff' }]}>Study Event</Text>
            </View>
            <View style={styles.content}>
                <Text style={[styles.title, isSentByUser && { color: '#fff' }]}>
                    {title}
                </Text>

                <View style={styles.row}>
                    <Ionicons name="time-outline" size={16} color={isSentByUser ? '#fff' : '#694df0'} />
                    <Text style={[styles.text, isSentByUser && { color: '#eee' }]}>{formattedDate}</Text>
                </View>

                <View style={styles.row}>
                    <Entypo name="location-pin" size={16} color={isSentByUser ? '#fff' : '#694df0'} />
                    <Text style={[styles.text, isSentByUser && { color: '#eee' }]}>{location}</Text>
                </View>
            </View>
        </View>
    );
};

export default StudyEventCard;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'column',
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
    receivedCard: {
        backgroundColor: '#e4e6eb',
    },
    leftStrip: {
        width: 4,
        borderRadius: 10,
        marginRight: 12,
    },
    sentStrip: {
        backgroundColor: '#fff',
    },
    receivedStrip: {
        backgroundColor: '#694df0',
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
        marginTop: 2,
    },
    text: {
        marginLeft: 6,
        color: '#555',
        fontSize: 13,
    },
});