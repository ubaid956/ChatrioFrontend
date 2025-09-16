import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import GenericModal from './GenericModal';

const IdeaBoardModal = ({ visible, onClose }) => {
    const [ideas, setIdeas] = React.useState([]);
    const [newIdea, setNewIdea] = React.useState('');

    const addIdea = () => {
        if (!newIdea.trim()) return;
        setIdeas([...ideas, { id: Date.now().toString(), text: newIdea }]);
        setNewIdea('');
    };

    return (
        <GenericModal visible={visible} onClose={onClose} title="Idea Board">
            <FlatList
                data={ideas}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}><Text style={styles.text}>{item.text}</Text></View>
                )}
                style={{ maxHeight: 200 }}
            />
            <TextInput
                placeholder="Share a new idea..."
                value={newIdea}
                onChangeText={setNewIdea}
                style={styles.input}
            />
            <TouchableOpacity onPress={addIdea} style={styles.addBtn}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>Add Idea</Text>
            </TouchableOpacity>
        </GenericModal>
    );
};

const styles = StyleSheet.create({
    item: {
        paddingVertical: 8,
    },
    text: {
        fontSize: 16,
    },
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

export default IdeaBoardModal;
