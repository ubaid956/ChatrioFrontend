import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native'

const { height, width } = Dimensions.get('window')
const CustomButton = ({ title, onPress, small, login, extraSmall, large}) => {
  return (
    <TouchableOpacity
      style={[styles.btn, {
        // width: small ? width * 0.65 : width * 0.85,
        width: extraSmall
            ? width * 0.3
            : small
            ? width * 0.65
            : large
            ? width * 0.9
            : width * 0.85,
          height: extraSmall
            ? height * 0.045
            : height * 0.06,
        
        backgroundColor: login ? "white" : '#694df0',
        borderColor: login ? '#694df0' : 'white',
        borderWidth: login ? 1 : 0,
      }]}

      onPress={onPress}>
      <Text style={[styles.text,
        {
          color: login ? '#0758C2' : 'white',
          fontSize: extraSmall ? 14 : small ? 14 : 18,
        }
      ]}>{title}</Text>

    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  btn: {

    height: height * 0.06,
    backgroundColor: '#694df0',

    borderRadius: 10,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    alignSelf: 'center'

  },
  text: {
    color: 'white',
    fontSize: 18

  }
})
export default CustomButton