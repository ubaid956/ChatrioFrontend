import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import GenericModal from './GenericModal';

const MeetingSchedulerModal = ({ visible, onClose }) => {
    const [title, setTitle] = React.useState('');
    const [dateTime, setDateTime] = React.useState('');

    const scheduleMeeting = () => {
        if (title && dateTime) {
            alert(`Meeting scheduled: ${title} at ${dateTime}`);
            setTitle('');
            setDateTime('');
        }
    };

    return (
        <GenericModal visible={visible} onClose={onClose} title="Meeting Scheduler">
            <TextInput placeholder="Meeting Title" value={title} onChangeText={setTitle} style={styles.input} />
            <TextInput placeholder="Date & Time (e.g. 25 June, 3 PM)" value={dateTime} onChangeText={setDateTime} style={styles.input} />
            <TouchableOpacity onPress={scheduleMeeting} style={styles.addBtn}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>Schedule</Text>
            </TouchableOpacity>
        </GenericModal>
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
    },
    addBtn: {
        backgroundColor: '#694df0',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
});

export default MeetingSchedulerModal;