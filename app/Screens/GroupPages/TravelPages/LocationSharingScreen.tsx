// This is working with android 

// import React, { useEffect, useState } from 'react';
// import {
//   View, ActivityIndicator, Alert, Dimensions
// } from 'react-native';
// import * as Location from 'expo-location';
// import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
// import { router } from 'expo-router';
// import CustomButton from '@/app/Components/CustomButton';
// import { WebView } from 'react-native-webview';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useGroup } from '@/context/GroupContext';
// import axios from 'axios';

// const { height } = Dimensions.get('window');

// const LocationSharingScreen = () => {
//   const [location, setLocation] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const { groupData } = useGroup();
//   const groupId = groupData.groupId;

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission denied', 'Location permission is required.');
//         return;
//       }

//       let loc = await Location.getCurrentPositionAsync({});
//       setLocation(loc.coords);
//     })();
//   }, []);

//   const handleSendLocation = async () => {
//     if (!location) return;

//     try {
//       setIsLoading(true);
//       const token = await AsyncStorage.getItem('userToken');

//       const payload = {
//         lat: location.latitude,
//         lng: location.longitude,
//         locationName: "Current Location",
//         message: ""
//       };

//       const response = await axios.post(
//         `https://32b5245c5f10.ngrok-free.app/api/travel/location/${groupId}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           }
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         Alert.alert('Success', 'Location shared successfully');
//         router.back();
//       } else {
//         Alert.alert('Error', 'Failed to share location');
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', 'Something went wrong');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const generateMapHTML = () => {
//     if (!location) return '';
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
//         <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
//         <style>
//           #map { height: 100%; width: 100%; }
//           html, body { margin: 0; padding: 0; height: 100%; }
//         </style>
//       </head>
//       <body>
//         <div id="map"></div>
//         <script>
//           var map = L.map('map').setView([${location.latitude}, ${location.longitude}], 15);
//           L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             maxZoom: 19,
//           }).addTo(map);
//           L.marker([${location.latitude}, ${location.longitude}]).addTo(map)
//             .bindPopup("You are here").openPopup();
//         </script>
//       </body>
//       </html>
//     `;
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <CustomHeader title="Share Location" onBackPress={() => router.back()} />
//       {location ? (
//         <WebView
//           originWhitelist={['*']}
//           source={{ html: generateMapHTML() }}
//           style={{ height: height * 0.7 }}
//         />
//       ) : (
//         <ActivityIndicator size="large" style={{ marginTop: 50 }} />
//       )}

//       <View style={{ padding: 20 }}>
//         <CustomButton
//           title={isLoading ? <ActivityIndicator color="#fff" /> : 'Share Location'}
//           onPress={handleSendLocation}
//           disabled={isLoading}
//           large
//         />
//       </View>
//     </View>
//   );
// };

// export default LocationSharingScreen;
import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Text,
  Linking
} from 'react-native';
import * as Location from 'expo-location';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { router } from 'expo-router';
import CustomButton from '@/app/Components/CustomButton';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGroup } from '@/context/GroupContext';
import axios from 'axios';

const { height } = Dimensions.get('window');

const LocationSharingScreen = () => {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const { groupData } = useGroup();
  const groupId = groupData.groupId;

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setPermissionDenied(true);
            Alert.alert(
              'Permission denied',
              'Location permission is required to share your location.'
            );
            return;
          }
        }

        // For iOS (with Expo)
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setPermissionDenied(true);
          Alert.alert(
            'Permission denied',
            'Location permission is required to share your location.'
          );
          return;
        }

        // Check if location services are enabled (iOS specific)
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          setPermissionDenied(true);
          Alert.alert(
            'Location services disabled',
            'Please enable location services in your device settings.'
          );
          return;
        }

        // Get current location
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeout: 15000, // 15 seconds timeout
        });
        setLocation(loc.coords);
      } catch (error) {
        console.error('Error getting location:', error);
        setPermissionDenied(true);
        Alert.alert(
          'Error',
          'Could not get your location. Please try again.'
        );
      }
    };

    requestLocationPermission();
  }, []);

  const handleSendLocation = async () => {
    if (!location) return;

    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');

      const payload = {
        lat: location.latitude,
        lng: location.longitude,
        locationName: "Current Location",
        message: ""
      };

      const response = await axios.post(
        `https://32b5245c5f10.ngrok-free.app/api/travel/location/${groupId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000 // 10 seconds timeout
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Location shared successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', 'Failed to share location');
      }
    } catch (err) {
      console.error('Location sharing error:', err);
      let errorMessage = 'Something went wrong';
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      } else if (err.request) {
        errorMessage = 'Network error - could not connect to server';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMapHTML = () => {
    if (!location) return '';
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
          #map { 
            height: 100%; 
            width: 100%; 
            position: absolute;
            top: 0;
            left: 0;
          }
          html, body { 
            margin: 0; 
            padding: 0; 
            height: 100%; 
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', {
            zoomControl: false,
            dragging: ${Platform.OS === 'ios' ? 'false' : 'true'},
            tap: ${Platform.OS === 'ios' ? 'false' : 'true'},
            doubleClickZoom: false,
            scrollWheelZoom: false,
            boxZoom: false,
            keyboard: false
          }).setView([${location.latitude}, ${location.longitude}], 15);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          
          var marker = L.marker([${location.latitude}, ${location.longitude}]).addTo(map);
          marker.bindPopup("<b>Your location</b>").openPopup();
          
          // iOS specific fix to prevent scrolling issues
          document.addEventListener('touchmove', function(e) {
            e.preventDefault();
          }, { passive: false });
          
          // Prevent default behavior for all touch events
          document.addEventListener('touchstart', function(e) {
            e.preventDefault();
          }, { passive: false });
        </script>
      </body>
      </html>
    `;
  };

  if (permissionDenied) {
    return (
      <View style={{ flex: 1 }}>
        <CustomHeader title="Share Location" onBackPress={() => router.back()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ textAlign: 'center', marginBottom: 20 }}>
            Location permission is required to share your location. Please enable it in your device settings.
          </Text>
          <CustomButton
            title="Open Settings"
            onPress={() => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            }}
            large
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Share Location" onBackPress={() => router.back()} />

      {location ? (
        <View style={{ flex: 1 }}>
          <WebView
            originWhitelist={['*']}
            source={{ html: generateMapHTML() }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
              </View>
            )}
            scalesPageToFit={Platform.OS === 'android'}
            scrollEnabled={false}
            overScrollMode="never"
            bounces={false}
          />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )}

      <View style={{ padding: 20 }}>
        <CustomButton
          title={isLoading ? <ActivityIndicator color="#fff" /> : 'Share Location'}
          onPress={handleSendLocation}
          disabled={isLoading || !location}
          large
        />
      </View>
    </View>
  );
};

export default LocationSharingScreen;