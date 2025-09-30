// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import { useLocalSearchParams, router } from 'expo-router';
// import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
// import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

// const ItineraryDetail = () => {
//   const { itinerary } = useLocalSearchParams();
//   const data = typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary;

//   return (
//     <View style={{ flex: 1, backgroundColor: '#ffffffff' }}>
//       <CustomHeader title="Itinerary Details" onBackPress={() => router.back()} />
//       <ScrollView contentContainerStyle={styles.container}>
//         {/* Title & Description */}
//         <View style={styles.card}>
//           <Text style={styles.title}>{data.title}</Text>
//           <Text style={styles.description}>{data.description}</Text>
//         </View>

//         {/* Route */}
//         <View style={styles.card}>
//           <View style={styles.sectionHeader}>
//             <Ionicons name="navigate" size={18} color="#694df0" />
//             <Text style={styles.sectionTitle}>Route</Text>
//           </View>
//           <Text style={styles.text}>{data.route || 'Not Provided'}</Text>
//         </View>

//         {/* Destinations */}
//         <View style={styles.card}>
//           <View style={styles.sectionHeader}>
//             <FontAwesome5 name="map-marker-alt" size={16} color="#694df0" />
//             <Text style={styles.sectionTitle}>Destinations</Text>
//           </View>
//           {data.destinations.map((dest, index) => (
//             <View key={index} style={styles.itemBox}>
//               <Text style={styles.itemTitle}>📍 {dest.name}</Text>
//               {dest.activities.map((act, i) => (
//                 <Text key={i} style={styles.subItem}>• {act}</Text>
//               ))}
//             </View>
//           ))}
//         </View>

//         {/* Transportation */}
//         <View style={styles.card}>
//           <View style={styles.sectionHeader}>
//             <Ionicons name="car-sport" size={18} color="#694df0" />
//             <Text style={styles.sectionTitle}>Transportation</Text>
//           </View>
//           {data.transportation.map((tran, index) => (
//             <View key={index} style={styles.itemBox}>
//               <Text style={styles.itemTitle}>
//                 {tran.mode || 'N/A'}: {tran.from} → {tran.to}
//               </Text>
//               <Text style={styles.subItem}>
//                 {tran.departureTime && new Date(tran.departureTime).toLocaleString()} -{' '}
//                 {tran.arrivalTime && new Date(tran.arrivalTime).toLocaleString()}
//               </Text>
//             </View>
//           ))}
//         </View>

//         {/* Accommodations */}
//         <View style={styles.card}>
//           <View style={styles.sectionHeader}>
//             <MaterialIcons name="hotel" size={20} color="#694df0" />
//             <Text style={styles.sectionTitle}>Accommodations</Text>
//           </View>
//           {data.accommodations.map((acc, index) => (
//             <View key={index} style={styles.itemBox}>
//               <Text style={styles.itemTitle}>{acc.name}</Text>
//               <Text style={styles.subItem}>{acc.address}</Text>
//               <Text style={styles.subItem}>
//                 🛏️ {acc.checkIn && new Date(acc.checkIn).toLocaleDateString()} - {acc.checkOut && new Date(acc.checkOut).toLocaleDateString()}
//               </Text>
//               <Text style={styles.subItem}>Booking Ref: {acc.bookingRef}</Text>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default ItineraryDetail;

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 6,
//   },
//   description: {
//     fontSize: 15,
//     color: '#6b7280',
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   sectionTitle: {
//     marginLeft: 8,
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#694df0',
//   },
//   itemBox: {
//     backgroundColor: '#f1f5f9',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//   },
//   itemTitle: {
//     fontWeight: '600',
//     fontSize: 14,
//     color: '#1f2937',
//     marginBottom: 4,
//   },
//   subItem: {
//     fontSize: 13,
//     color: '#4b5563',
//     marginLeft: 4,
//   },
//   text: {
//     fontSize: 14,
//     color: '#374151',
//   },
// });

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DetailScreen = () => {
  const { type, data } = useLocalSearchParams();
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
  const [items, setItems] = useState(parsedData.items);
  const [loadingIndex, setLoadingIndex] = useState(null);

  const handleTogglePackStatus = async (checklistId, itemId, index) => {
    try {
      setLoadingIndex(index); // show loading spinner for this item
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert("Unauthorized", "No token found");
        return;
      }

      await axios.put(
        `https://37prw4st-5000.asse.devtunnels.ms/api/travel/${checklistId}/${itemId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update item status locally
      const updatedItems = [...items];
      updatedItems[index].isPacked = !updatedItems[index].isPacked;
      setItems(updatedItems);
    } catch (error) {
      Alert.alert("Error", "Failed to update item.");
      console.error("Toggle error:", error.response?.data || error.message);
    } finally {
      setLoadingIndex(null); // stop loading
    }
  };


  const renderItinerary = () => (
    <>
      {/* Title & Description */}
      <View style={styles.card}>
        <Text style={styles.title}>{parsedData.title}</Text>
        <Text style={styles.description}>{parsedData.description}</Text>
      </View>

      {/* Route */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="navigate" size={18} color="#694df0" />
          <Text style={styles.sectionTitle}>Route</Text>
        </View>
        <Text style={styles.text}>{parsedData.route || 'Not Provided'}</Text>
      </View>

      {/* Destinations */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <FontAwesome5 name="map-marker-alt" size={16} color="#694df0" />
          <Text style={styles.sectionTitle}>Destinations</Text>
        </View>
        {parsedData.destinations.map((dest, index) => (
          <View key={index} style={styles.itemBox}>
            <Text style={styles.itemTitle}>📍 {dest.name}</Text>
            {dest.activities.map((act, i) => (
              <Text key={i} style={styles.subItem}>• {act}</Text>
            ))}
          </View>
        ))}
      </View>

      {/* Transportation */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="car-sport" size={18} color="#694df0" />
          <Text style={styles.sectionTitle}>Transportation</Text>
        </View>
        {parsedData.transportation.map((tran, index) => (
          <View key={index} style={styles.itemBox}>
            <Text style={styles.itemTitle}>
              {tran.mode || 'N/A'}: {tran.from} → {tran.to}
            </Text>
            <Text style={styles.subItem}>
              {tran.departureTime && new Date(tran.departureTime).toLocaleString()} -{' '}
              {tran.arrivalTime && new Date(tran.arrivalTime).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      {/* Accommodations */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="hotel" size={20} color="#694df0" />
          <Text style={styles.sectionTitle}>Accommodations</Text>
        </View>
        {parsedData.accommodations.map((acc, index) => (
          <View key={index} style={styles.itemBox}>
            <Text style={styles.itemTitle}>{acc.name}</Text>
            <Text style={styles.subItem}>{acc.address}</Text>
            <Text style={styles.subItem}>
              🛏️ {acc.checkIn && new Date(acc.checkIn).toLocaleDateString()} - {acc.checkOut && new Date(acc.checkOut).toLocaleDateString()}
            </Text>
            <Text style={styles.subItem}>Booking Ref: {acc.bookingRef}</Text>
          </View>
        ))}
      </View>
    </>
  );

  const renderChecklist = () => {
    const totalItems = parsedData.items.length;
    const packedItems = parsedData.items.filter(i => i.isPacked).length;

    return (
      <>
        {/* Destination Title */}
        <View style={styles.card}>
          <Text style={styles.title}>{parsedData.destination} Trip</Text>
          <Text style={styles.description}>
            {new Date(parsedData.travelDate.from).toDateString()} - {new Date(parsedData.travelDate.to).toDateString()}
          </Text>
        </View>

        {/* Items List */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="suitcase-rolling" size={18} color="#694df0" />
            <Text style={styles.sectionTitle}>Checklist Items</Text>
          </View>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleTogglePackStatus(parsedData._id, item._id, index)}
              disabled={loadingIndex === index}
            >
              <View style={styles.itemBox}>
                <Text style={styles.itemTitle}>
                  • {item.name}{' '}
                  {loadingIndex === index ? (
                    <ActivityIndicator size="small" color="#694df0" />
                  ) : (
                    <Text style={{ color: item.isPacked ? 'green' : 'red' }}>
                      ({item.isPacked ? 'Packed' : 'Not Packed'})
                    </Text>
                  )}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

        </View>

        {/* Summary */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bar-chart-outline" size={20} color="#694df0" />
            <Text style={styles.sectionTitle}>Summary</Text>
          </View>
          <Text style={styles.text}>
            {items.filter(i => i.isPacked).length} / {items.length} items packed
          </Text>
          <Text style={styles.text}>
            {Math.round((items.filter(i => i.isPacked).length / items.length) * 100)}% Completed
          </Text>

        </View>
      </>
    );
  };



  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader title="Details" onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.container}>
        {type === 'itinerary' ? renderItinerary() : renderChecklist()}
      </ScrollView>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: '#6b7280',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#694df0',
  },
  itemBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  itemTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 4,
  },
  subItem: {
    fontSize: 13,
    color: '#4b5563',
    marginLeft: 4,
  },
  text: {
    fontSize: 14,
    color: '#374151',
  },
});
