// Components/LoadingModal.tsx
import React from 'react';
import { View, Text, Modal, StyleSheet, Image, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const LoadingModal = ({ visible }: { visible: boolean }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.loaderWrapper}>
            <LottieView
              source={require('@/assets/animations/circular-loader.json')}
              autoPlay
              loop
              style={styles.loader}
            />
            <Image
              source={require('@/assets/images/Trasnparentlogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.message}>AI is generating personalized questions...</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 16,
    width: width * 0.8,
    alignItems: 'center',
    elevation: 5,
  },
  loaderWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loader: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
  logo: {
    width: 60,
    height: 60,
    zIndex: 2,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    fontWeight: '500',
  },
});
