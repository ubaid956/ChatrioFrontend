import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import GenericModal from './GenericModal';

const SharedNotesModal = ({ visible, onClose }) => {
    const [notes, setNotes] = React.useState('');

    return (
        <GenericModal visible={visible} onClose={onClose} title="Shared Notes">
            <TextInput
                multiline
                placeholder="Write shared notes here..."
                value={notes}
                onChangeText={setNotes}
                style={styles.textArea}
            />
        </GenericModal>
    );
};

const styles = StyleSheet.create({
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        height: 150,
        textAlignVertical: 'top',
    },
});

export default SharedNotesModal;
