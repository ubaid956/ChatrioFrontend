// components/Group_Components/NoteItem.js
import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

const NoteItem = ({ note, isSentByUser }) => {
  const { width } = useWindowDimensions();
  const containerWidth = width * 0.78;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: isSentByUser ? 'flex-end' : 'flex-start',
        marginVertical: 6,
        paddingHorizontal: 10,
      }}
    >
      <View
        style={[
          styles.noteContainer,
          { maxWidth: containerWidth },
          isSentByUser ? styles.sent : styles.received,
        ]}
      >
        {!isSentByUser && (
          <Text style={[styles.noteSender, styles.textDark]}>
            {note.senderName}
          </Text>
        )}

        <Text style={[styles.noteTitle, isSentByUser ? styles.textWhite : styles.textDark]}>
          📝 {note.title}
        </Text>

        <Text style={[styles.noteContent, isSentByUser ? styles.textLight : styles.textMuted]}>
          {note.content}
        </Text>

        <Text style={[styles.timeText, isSentByUser ? styles.textMuted : styles.textLightDark]}>
          {new Date(note.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  noteContainer: {
    padding: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sent: {
    backgroundColor: '#0984e3',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  received: {
    backgroundColor: '#dfe6e9',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  noteSender: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  timeText: {
    fontSize: 10,
    marginTop: 8,
    alignSelf: 'flex-end',
  },

  // Color utility styles
  textWhite: { color: '#fff' },
  textLight: { color: '#f5f5f5' },
  textMuted: { color: 'black' },
  textDark: { color: '#111' },
  textLightDark: { color: '#555' },
});

export default NoteItem;
