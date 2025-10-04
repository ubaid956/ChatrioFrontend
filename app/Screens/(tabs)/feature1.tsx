import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomTabs from '@/app/Components/Group_Components/CustomTabs';
import { globalStyles } from '@/Styles/globalStyles';
import TaskCard from '@/app/Components/Group_Features/CardComponent';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from "react-native-calendars";
import { useGroup } from '@/context/GroupContext';
import StudyEventCard from '../../Components/Group_Features/School/StudyEventCard'
import HomeCard from '@/app/Components/Group_Features/Home/HomeCard';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import ItineraryCard from '@/app/Components/Group_Features/Travel/ItineraryCard';
import GroupHeader from '@/app/Components/Group_Components/Headers/GroupHeader';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');
const Feature1 = () => {
    const [allTasks, setAllTasks] = useState([]);
    const [schoolEvents, setSchoolEvents] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [itineraryLoading, setItineraryLoading] = useState(false);


    const [filteredTasks, setFilteredTasks] = useState([]);
    const [selectedTab, setSelectedTab] = useState("All");
    const [loading, setLoading] = useState(true);
    const [shoppingItems, setShoppingItems] = useState([]);
    const [shoppingLoading, setShoppingLoading] = useState(false);
    const { groupData } = useGroup();

    console.log(`Feature 1: GroupID: ${groupData.groupId}, GroupName:  ${groupData.groupName}, GroupType${groupData.groupType}`);



    const [selectedDate, setSelectedDate] = useState(null);

    const onDayPress = (day) => {
        setSelectedDate(day.dateString); // Update the selected date
    };


    useEffect(() => {
        if (groupData.groupType === "Work") {
            fetchTasks();
        } else if (groupData.groupType === "School") {
            fetchSchoolEvents();
        }
        else if (groupData.groupType === "Home") {
            fetchShoppingItems();
        }
        else if (groupData.groupType === "Travel") {
            fetchItineraries();
        }

    }, []);



    const fetchTasks = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                console.error("No token found.");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `https://chatrio-backend.onrender.com/api/work/task/${groupData.groupId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAllTasks(response.data);
            setFilteredTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSchoolEvents = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            const res = await axios.get(
                `https://chatrio-backend.onrender.com/api/school/events/${groupData.groupId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSchoolEvents(res.data);

        } catch (err) {
            console.error("Failed to fetch school events", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchShoppingItems = async () => {
        try {
            setShoppingLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                console.error("No token found.");
                setShoppingLoading(false);
                return;
            }

            const res = await axios.get(
                `https://chatrio-backend.onrender.com/api/home/shopping/${groupData.groupId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setShoppingItems(res.data.items); // Your API response structure
        } catch (err) {
            console.error("Failed to fetch shopping items", err);
        } finally {
            setShoppingLoading(false);
        }
    };

    const fetchItineraries = async () => {
        try {
            setItineraryLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            const res = await axios.get(
                `https://chatrio-backend.onrender.com/api/travel/itinerary/${groupData.groupId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setItineraries(res.data);
        } catch (err) {
            console.error("Failed to fetch itineraries", err);
        } finally {
            setItineraryLoading(false);
        }
    };



    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        if (tab === "All") {
            setFilteredTasks(allTasks);
        } else {
            setFilteredTasks(allTasks.filter(task =>
                task.status?.toLowerCase() === tab.toLowerCase()
            ));
        }
    };
    return (
        <View style={[globalStyles.container]}>

            {groupData.groupType === "Work" && (
                <>
                    <CustomTabs
                        tabs={['All', 'To Do', 'In Progress', 'Done']}
                        initialTab="All"
                        onTabChange={handleTabChange}
                    />

                    {loading ? (
                        <View style={styles.centerContent}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    ) : filteredTasks.length === 0 ? (
                        <View style={styles.centerContent}>
                            <Text style={styles.noTaskText}>No tasks</Text>
                        </View>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {filteredTasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    isTask={true}
                                    title={task.title}
                                    description={task.description}
                                    dueDate={new Date(task.endTime).toISOString().split("T")[0]}
                                    assignee="Sarah Chen" // Replace dynamically if needed
                                    status={task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                />
                            ))}
                        </ScrollView>
                    )}
                </>
            )}

            {groupData.groupType === 'School' && (
                <>
                    <GroupHeader title="School Events" emoji="graduation-cap" />

                    <View style={{
                        backgroundColor: '#694df0',
                        borderRadius: 16,
                        alignSelf: 'center',
                        width: width * 0.9,
                        marginTop: height * 0.02,
                        padding: 10, // optional padding
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

                    <View
                    >
                        <View style={styles.dateContainer}>
                            <Text style={[{ fontWeight: 'bold', fontSize: 18 }]}>My Schedule -</Text>
                            <Text style={{ fontWeight: 'bold' }}> June 30, 2025</Text>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {schoolEvents.map((event) => (
                                <StudyEventCard
                                    key={event._id}
                                    title={event.title}
                                    date={event.date}
                                    type={event.title?.toLowerCase().includes("quiz") ? "Quiz" : "Assignment"}
                                />
                            ))}
                        </ScrollView>


                    </View>
                </>
            )}
            {groupData.groupType === "Home" && (
                <>
                    <View style={globalStyles.groupHeader}>
                        <Text style={globalStyles.groupTitle}>Shopping List</Text>
                        <TouchableOpacity>
                            <FontAwesome5 name="filter" size={24} color="#694df0" />
                        </TouchableOpacity>
                    </View>

                    {shoppingLoading ? (
                        <View style={styles.centerContent}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    ) : shoppingItems.length === 0 ? (
                        <View style={styles.centerContent}>
                            <Text style={styles.noTaskText}>No shopping items</Text>
                        </View>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {shoppingItems.map((item) => (
                                <HomeCard
                                    key={item._id}
                                    type="shopping"
                                    title={item.name}
                                    subText={item.quantity}
                                    onEdit={() => { }}
                                    onDelete={() => { }}
                                />
                            ))}
                        </ScrollView>
                    )}
                </>
            )}

            {groupData.groupType === "Travel" && (
                <>
                    <View style={globalStyles.groupHeader}>
                        <Text style={globalStyles.groupTitle}>Itinerary </Text>
                        <TouchableOpacity>
                            <FontAwesome5 name="search" size={24} color="#694df0" />
                        </TouchableOpacity>
                    </View>

                    {itineraryLoading ? (
                        <View style={styles.centerContent}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    ) : itineraries.length === 0 ? (
                        <View style={styles.centerContent}>
                            <Text style={styles.noTaskText}>No itineraries found</Text>
                        </View>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {itineraries.map((item) => (
                                <ItineraryCard
                                    key={item._id}
                                    title={item.title}
                                    description={item.description}
                                    startDate={item.times?.startDate}
                                    endDate={item.times?.endDate}
                                    route={item.route}
                                    onPress={() => {
                                        console.log("clicked", item);
                                        router.push({
                                            pathname: '/Screens/GroupPages/TravelPages/DetailScreen',
                                            params: {
                                                type: 'itinerary',
                                                data: JSON.stringify(item),
                                            }
                                        });
                                    }}

                                />
                            ))}
                        </ScrollView>
                    )}





                </>
            )}

        </View>
    );


};

const styles = StyleSheet.create({
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    noTaskText: {
        fontSize: 16,
        color: 'grey',
    },
    dateContainer: {
        width: width * 0.9,
        height: height * 0.06,
        alignSelf: 'center',
        marginTop: height * 0.02,
        marginBottom: height * 0.01,
        alignItems: 'center',
        flexDirection: 'row',
        // paddingHorizontal: width * 0.05,
        marginTop: height * 0.02,

    }
});

export default Feature1;
