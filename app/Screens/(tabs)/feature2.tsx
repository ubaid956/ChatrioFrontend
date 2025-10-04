import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { globalStyles } from '@/Styles/globalStyles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CardComponent from '@/app/Components/Group_Features/CardComponent'
import axios from 'axios'
import { Linking } from 'react-native';
import { useGroup } from '@/context/GroupContext';
import CustomTabs from '@/app/Components/Group_Components/CustomTabs'
import AssignmentCard from '../../Components/Group_Features/School/AssignmentCard'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Calendar } from "react-native-calendars";
import HomeCard from '@/app/Components/Group_Features/Home/HomeCard'
import CheckListCard from '@/app/Components/Group_Features/Travel/CheckListCard'
import GroupHeader from '@/app/Components/Group_Components/Headers/GroupHeader'
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window')

const feature2 = () => {
  const [meetings, setMeetings] = useState([])
  const [assignments, setAssignments] = useState([]);
  const [events, setEvents] = useState([]);  // Added state for events
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [checklistData, setChecklistData] = useState([]);
  const [checklistLoading, setChecklistLoading] = useState(false);


  const { groupData } = useGroup();

  console.log(`Feature 2: GroupID: ${groupData.groupId}, GroupName:  ${groupData.groupName}, GroupType${groupData.groupType}`);

  const [selectedDate, setSelectedDate] = useState(null);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString); // Update the selected date
  };

  useEffect(() => {
    if (groupData.groupType === "Work") {
      fetchMeetings();
    } else if (groupData.groupType === "School") {
      fetchAssignments();
    } else if (groupData.groupType === "Home") {
      fetchEvents();
    } else if (groupData.groupType === "Travel") {
      fetchChecklist(); // 🔥 Call this
    }
  }, []);


  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        return;
      }
      const response = await axios.get(
        `https://chatrio-backend.onrender.com/api/home/event/${groupData.groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setEvents(response.data || []);
    } catch (error) {
      console.error("Error fetching events:", error.response?.data || error.message);
    } finally {
      setLoadingEvents(false);
    }
  };



  const fetchMeetings = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(
        `https://chatrio-backend.onrender.com/api/work/meeting/${groupData.groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      setMeetings(response.data.meetings || []);
    } catch (error) {
      console.error('Error fetching meetings:', error.response?.data || error.message);
    }
  };

  const fetchAssignments = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await axios.get(
        `https://chatrio-backend.onrender.com/api/school/assignment/${groupData.groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssignments(response.data || []);
    } catch (error) {
      console.error("Error fetching assignments:", error.response?.data || error.message);
    }
  };

  const fetchChecklist = async () => {
    try {
      setChecklistLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error("No token found");
        return;
      }

      const res = await axios.get(
        `https://chatrio-backend.onrender.com/api/travel/checklist/${groupData.groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setChecklistData(res.data || []);
    } catch (error) {
      console.error("Error fetching travel checklist:", error.response?.data || error.message);
    } finally {
      setChecklistLoading(false);
    }
  };


  return (
    <View style={[globalStyles.container]}>


      {groupData.groupType == "Work" && (
        <>
          <View style={styles.dateContainer}>
            <Text style={[{ color: '#694df0', fontWeight: 'bold' }]}>Today , Saturday</Text>
            <Text style={{ color: '#694df0' }}>June 30, 2025</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {meetings.map((meeting) => (

              <CardComponent
                key={meeting._id}
                isTask={false}
                title={meeting.topic}
                dueDate={meeting.start_time?.split('T')[0]}
                time={new Date(meeting.start_time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                platform="Zoom Meeting"
                duration={`${meeting.duration} minutes`}
                participants={['M', 'S', 'A', 'Y']}
                onJoin={() => Linking.openURL(meeting.join_url)}
              />

            ))}
          </ScrollView>
        </>
      )}

      {groupData.groupType == "School" && (
        <>
          <GroupHeader title="School Assignments" emoji="search" />
          <ScrollView showsVerticalScrollIndicator={false}>
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment._id}
                title={assignment.title}
                dueDate={assignment.dueDate}
                creatorName={assignment.createdBy?.name}
                onPress={() => {
                  router.push({
                    pathname: '/Screens/GroupPages/SchoolPages/SubmitAssignment',
                    params: {
                      id: assignment._id,
                      title: assignment.title,
                      description: assignment.description,
                      dueDate: assignment.dueDate,
                      creatorName: assignment.createdBy?.name,
                    }
                  });
                }}
              />
            ))}
          </ScrollView>

        </>
      )}

      {groupData.groupType == "Home" && (

        <>
          <View style={globalStyles.groupHeader}>
            <Text style={globalStyles.groupTitle}>Events</Text>
            <TouchableOpacity>
              <FontAwesome5 name="filter" size={24} color="#694df0" />


            </TouchableOpacity>
          </View>
          <View style={{
            backgroundColor: '#694df0',
            borderRadius: 16,
            alignSelf: 'center',
            width: width * 0.9,
            marginTop: height * 0.02,
            padding: 10, // optional padding
            marginBottom: height * 0.02,
            // shadowColor: "#000",
          }}>
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
              }}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedDotColor: "#694df0", // dot stays themed
                  selectedColor: "#ffffff", // selected date background color
                },
              }}
              theme={{
                backgroundColor: "#694df0",
                calendarBackground: "#694df0",
                textSectionTitleColor: "white",
                dayTextColor: "white",
                todayTextColor: "black",
                selectedDayTextColor: "#694df0", // text color on white selected date
                selectedDayBackgroundColor: "#ffffff",
                arrowColor: "white",
                monthTextColor: "white",
                textDisabledColor: "grey",
                dotColor: "white",
                selectedDotColor: "#694df0", // matches the theme
              }}
            />



          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {loadingEvents ? (
              <ActivityIndicator size="large" color="#694df0" style={{ marginTop: 20 }} />
            ) : (
              events.map((event) => (
                <HomeCard
                  key={event._id}
                  type="reminder"
                  title={`Reminder for event: ${event.title}`}
                  subText={event.title}
                  date={new Date(event.date).toLocaleString()}
                  user="Family"
                  onEdit={() => { }}
                  onDelete={() => { }}
                />
              ))
            )}
          </ScrollView>


        </>
      )}

      {groupData.groupType === "Travel" && (
        <>
          <View style={globalStyles.groupHeader}>
            <Text style={globalStyles.groupTitle}>Check List</Text>
            <TouchableOpacity>
              <FontAwesome5 name="search" size={24} color="#694df0" />
            </TouchableOpacity>
          </View>

          {checklistLoading ? (
            <ActivityIndicator size="large" color="#694df0" style={{ marginTop: 20 }} />
          ) : checklistData.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>No checklist found</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {checklistData.map((item) => (
                <CheckListCard
                  key={item._id}
                  title={item.destination}
                  startDate={item.travelDate?.from}
                  endDate={item.travelDate?.to}
                  totalItems={item.items?.length || 0}
                  packedItems={item.items?.filter(i => i.packed)?.length || 0}
                  onPress={() => {
                    router.push({
                      pathname: '/Screens/GroupPages/TravelPages/DetailScreen',
                      params: {
                        type: 'checklist',
                        data: JSON.stringify(item),
                      },
                    });
                  }}
                />
              ))}
            </ScrollView>
          )}
        </>
      )}


    </View>
  )
}

export default feature2


const styles = StyleSheet.create({
  dateContainer: {
    width: width * 0.9,
    height: height * 0.06,
    backgroundColor: '#eef2ff',
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: width * 0.05,
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,

  }


})