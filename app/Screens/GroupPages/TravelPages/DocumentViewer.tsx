import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';

const DocumentViewer = () => {
  const { fileUrl } = useLocalSearchParams();

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: fileUrl }}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        )}
      />
    </View>
  );
};

export default DocumentViewer;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
