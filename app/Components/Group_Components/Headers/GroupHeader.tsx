import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { globalStyles } from '@/Styles/globalStyles'
const GroupHeader = ({title, emoji}) => {
    return (
        <View style={globalStyles.groupHeader}>
            <Text style={globalStyles.groupTitle}>{title}</Text>
            <TouchableOpacity>
                <FontAwesome5 name={emoji} size={24} color="#694df0" />
            </TouchableOpacity>
        </View>
    )
}

export default GroupHeader