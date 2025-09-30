import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplitPaid = () => {
  const { data } = useLocalSearchParams();
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

  const [loading, setLoading] = useState(false);
  const [paidByUsers, setPaidByUsers] = useState(parsedData.paidByUsers || []);

  const handleMarkAsPaid = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.post(
        `https://37prw4st-5000.asse.devtunnels.ms/api/travel/splitexpense/${parsedData._id}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPaidByUsers(res.data.expense.paidByUsers || []);
      Alert.alert("Success", "Marked as paid successfully!");
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to mark as paid");
    } finally {
      setLoading(false);
    }
  };

  const totalPeople = parsedData.sharedWith.length;
  const paidCount = paidByUsers.length;
  const unpaidCount = totalPeople - paidCount;
  const percentage = Math.round((paidCount / totalPeople) * 100);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader title="Split Expense" onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Amount Info */}
        <View style={styles.card}>
          <Text style={styles.title}>💰 {parsedData.title}</Text>
          <Text style={styles.subText}>Total Amount: ${parsedData.amount}</Text>
          <Text style={styles.subText}>Paid by: {parsedData.paidBy.name}</Text>
        </View>

        {/* Shared With */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="users" size={16} color="#694df0" />
            <Text style={styles.sectionTitle}>Participants</Text>
          </View>
          {parsedData.sharedWith.map((user) => (
            <View key={user._id} style={styles.itemBox}>
              <Text style={styles.itemTitle}>{user.name}</Text>
              <Text style={{ color: paidByUsers.includes(user._id) ? 'green' : 'red' }}>
                {paidByUsers.includes(user._id) ? 'Paid' : 'Unpaid'}
              </Text>
            </View>
          ))}
        </View>

        {/* Progress */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bar-chart" size={20} color="#694df0" />
            <Text style={styles.sectionTitle}>Payment Progress</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
          </View>
          <Text style={styles.text}>{paidCount}/{totalPeople} paid ({percentage}%)</Text>
        </View>

        {/* Mark as Paid Button */}
        {!paidByUsers.includes(parsedData.loggedInUserId) && (
          <TouchableOpacity style={styles.btn} onPress={handleMarkAsPaid} disabled={loading}>
            <Text style={styles.btnText}>{loading ? 'Processing...' : 'Mark as Paid'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default SplitPaid;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
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
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1f2937',
  },
  text: {
    marginTop: 6,
    fontSize: 14,
    color: '#374151',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#694df0',
    borderRadius: 5,
  },
  btn: {
    backgroundColor: '#694df0',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
