import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';


const { width, height } = Dimensions.get('window');

const Splash = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/Screens/Welcome'); // Navigate to Welcome after 3 seconds
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['white', 'white']} style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/images/chatrio_logo_trans.png')}
          style={styles.image}
        />
       
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: width*0.5, height: height*0.5, resizeMode: 'contain', marginBottom: 10 },
  text: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: Dimensions.get('window').height * 0.02,
  },
});

export default Splash;