// File: Components/GroupFeatures/PollsModal.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import GenericModal from './GenericModal';

const PollsModal = ({ visible, onClose }) => {
    const [question, setQuestion] = React.useState('');
    const [option, setOption] = React.useState('');
    const [options, setOptions] = React.useState([]);

    const addOption = () => {
        if (!option.trim()) return;
        setOptions([...options, { id: Date.now().toString(), text: option }]);
        setOption('');
    };

    const createPoll = () => {
        if (!question.trim() || options.length < 2) {
            alert('Enter a question and at least two options.');
            return;
        }
        alert(`Poll Created: ${question}\nOptions: ${options.map(o => o.text).join(', ')}`);
        setQuestion('');
        setOptions([]);
    };

    return (
        <GenericModal visible={visible} onClose={onClose} title="Create Poll">
            <TextInput placeholder="Poll Question" value={question} onChangeText={setQuestion} style={styles.input} />
            <FlatList
                data={options}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Text style={styles.optionText}>• {item.text}</Text>
                )}
                style={{ maxHeight: 100 }}
            />
            <TextInput placeholder="Add Option" value={option} onChangeText={setOption} style={styles.input} />
            <TouchableOpacity onPress={addOption} style={styles.addBtn}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>Add Option</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={createPoll} style={[styles.addBtn, { marginTop: 5 }]}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>Create Poll</Text>
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
    optionText: {
        fontSize: 16,
        marginVertical: 4,
    },
});

export default PollsModal;