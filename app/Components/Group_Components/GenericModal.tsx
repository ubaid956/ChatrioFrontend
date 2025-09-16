// Components/GroupFeatures/GenericModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GenericModal = ({ visible, onClose, title, children }) => {
    return (
        <Modal animationType="slide" visible={visible} transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>{title}</Text>
                    {children}
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Text style={{ color: '#fff' }}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    closeBtn: {
        marginTop: 20,
        backgroundColor: '#694df0',
        padding: 10,
        borderRadius: 8,
        alignSelf: 'flex-end',
    },
});

export default GenericModal;
