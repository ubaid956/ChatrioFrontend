import React from 'react';
import { StyleSheet, Text, TouchableOpacity,Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');
const Option = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.optionButton} onPress={onPress}>
    <Ionicons name={icon} size={32} color="#694df0" />
    <Text style={styles.optionText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({

    optionText: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 4,
        color: '#333',
    },
     optionButton: {
        // width: '30%', // ✅ 3 items per row
        
        width: width * 0.22, // ✅ 30% of screen width
        height: width * 0.2, // ✅ 30% of screen width for square items

        aspectRatio: 1, // ✅ ensures square grid items
        backgroundColor: '#fff',
        borderRadius: height * 0.22/2, // ✅ 2% of screen height
        marginBottom: height * 0.02, // ✅ 2% of screen height
        marginHorizontal: width * 0.03,

        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        padding:5
    },
})
export default Option;