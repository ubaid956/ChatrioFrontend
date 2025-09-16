import React from 'react';
import { View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { router } from 'expo-router';

const { height } = Dimensions.get('window');

const ViewSharedLocation = () => {
  const { lat, lng, name } = useLocalSearchParams();

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <style>
        #map { height: 100%; width: 100%; }
        html, body { margin: 0; padding: 0; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${lat}, ${lng}], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);
        L.marker([${lat}, ${lng}]).addTo(map).bindPopup("${name}").openPopup();
      </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Location" onBackPress={() => router.back()} />
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={{ height: height }}
      />
    </View>
  );
};

export default ViewSharedLocation;
