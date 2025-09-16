import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions , TouchableOpacity} from 'react-native';

const { width } = Dimensions.get('window');

const CategoryCard = ({ title, icon ,onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.4,
    paddingVertical: 20,
    backgroundColor: '#F7F9FE',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5D5FEF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    margin: 10,
  },
  iconWrapper: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
});

export default CategoryCard;
