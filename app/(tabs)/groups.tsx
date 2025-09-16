import { View, Text, Dimensions, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, RefreshControl, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import HomeHeader from '../Components/HomeHeader'
import { globalStyles } from '@/Styles/globalStyles'
import MyTabs from '../Components/MyTabs'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MessageComponent from '../Components/MessagesComonent'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { useGroup } from '@/context/GroupContext'
import CategoryCard from '../Components/Group_Components/CategoryCard'
import { useTranslation } from 'react-i18next';
const { height, width } = Dimensions.get('window')

const Groups = () => {
  const { t, i18n } = useTranslation();
  const [allGroups, setAllGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Work');
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { setGroupData } = useGroup();


  const fetchGroups = async () => {
    setRefreshing(true);
    const token = await AsyncStorage.getItem('userToken');
    try {
      // Load current user data from AsyncStorage
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setCurrentUser(userData);
      }

      const res = await axios.get('https://32b5245c5f10.ngrok-free.app/api/groups', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllGroups(res.data);
      const filtered = res.data.filter(group => group.type === activeTab);
      setFilteredGroups(filtered);
    } catch (error) {
      console.error('Error fetching groups:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch groups on initial render and when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchGroups();
    }, [activeTab])
  );

  const filterGroupsByType = (type) => {
    setActiveTab(type);
    const filtered = allGroups.filter(group => group.type === type);
    setFilteredGroups(filtered);
  };

  const onRefresh = () => {
    fetchGroups();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <HomeHeader
        title={t(`categories.${activeTab.toLowerCase()}`)}
        //  createGroup
        avatar={currentUser?.pic}
        selectedTab={activeTab} // Pass the active tab to the header
      />


      <View style={{ paddingHorizontal: width * 0.04 }}>
        <View style={globalStyles.textCon}>
          <Text style={[globalStyles.title, { marginLeft: '0' }]}> {t("greeting", { name: "Alex" })}</Text>
          <Text>
            {new Date().toLocaleDateString(i18n.language, {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </Text>


          {/* <MyTabs activeTab={activeTab} onTabPress={filterGroupsByType} /> */}
        </View>

        <Text>{t("readyMessage")}
        </Text>
        <Text style={[globalStyles.homeText, { marginVertical: height * 0.01 }]}>{t("categories.title")}</Text>


        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', }}>
          <CategoryCard
            title={t("categories.work")}

            onPress={() => {
              setGroupData(prev => ({
                ...prev,
                groupType: 'Work',
              }));
              router.push('/Screens/GroupPages/Groups');
            }}


            icon={require('../../assets/images/GroupIcons/work.png')} // Or { uri: 'https://example.com/icon.png' }
          />
          <CategoryCard
            title={t("categories.home")}

            icon={require('../../assets/images/GroupIcons/home.png')} // Or { uri: 'https://example.com/icon.png' }
            onPress={() => {
              setGroupData(prev => ({
                ...prev,
                groupType: 'Home',
              }));
              router.push('/Screens/GroupPages/Groups');
            }}

          />
          <CategoryCard
            title={t("categories.school")}
            icon={require('../../assets/images/GroupIcons/school.png')} // Or { uri: 'https://example.com/icon.png' }
            onPress={() => {
              setGroupData(prev => ({
                ...prev,
                groupType: 'School',
              }));
              router.push('/Screens/GroupPages/Groups');
            }}
          />
          <CategoryCard
            title={t("categories.travel")}
            icon={require('../../assets/images/GroupIcons/travel.png')} // Or { uri: 'https://example.com/icon.png' }
            onPress={() => {
              setGroupData(prev => ({
                ...prev,
                groupType: 'Travel',
              }));
              router.push('/Screens/GroupPages/Groups');
            }}
          />
        </View>

        <Text style={[globalStyles.homeText, { marginVertical: height * 0.02 }]}> {t("todayHighlights")}</Text>
        {/* {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : filteredGroups.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
          <Text style={{ fontSize: 16, color: '#888' }}>No groups available</Text>
        </View>
      ) : (
        <FlatList
          data={filteredGroups}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <MessageComponent
              name={item.name}
              message={`${item.members.length} members`}
              time={new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              unreadCount={0}
              profileImage={item.pic}
              // onPress={() => router.push({ pathname: '/Screens/GroupChatScreen', params: { groupId: item._id, groupName: item.name } })}

              onPress={() =>
              // router.push({
              //   pathname: '../../Screens/(tabs)/groupchats',
              //   params: {
              //     groupId: item._id,
              //     groupName: item.name,
              //     groupType: item.type, // ✅ Pass group type
              //   },
              // })
              {
                setGroupData({
                  groupId: item._id,
                  groupName: item.name,
                  groupType: item.type,
                });

                router.push('../../Screens/(tabs)/groupchats');
              }
              }

            />
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              style={{ justifyContent: 'center', alignSelf: 'center' }}
            />
          }
        />
      )} */}

      </View>
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/Screens/CreateGroup')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Groups

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#694df0',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});