import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DocumentCard = ({
  title = 'Passport Scan',
  date = '2025-06-15',
  uploadedBy = 'Michael Chen',
  thumbnail = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/US_Passport_2023_cover.png/480px-US_Passport_2023_cover.png', // Replace with your URI
}) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US');

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: thumbnail }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.iconOverlay}>
          <Ionicons name="document-text-outline" size={16} color="#555" />
        </View>
      </View>

      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={14} color="#694df0" />
        <Text style={styles.metaText}>{formattedDate}</Text>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="person-outline" size={14} color="#694df0" />
        <Text style={styles.metaText}>{uploadedBy}</Text>
      </View>
    </View>
  );
};

export default DocumentCard;

const styles = StyleSheet.create({
  card: {
    width: width * 0.42,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    margin: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
  },
  imageWrapper: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconOverlay: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 4,
  },
});
