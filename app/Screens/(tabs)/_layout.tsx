// import { Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { FontAwesome5 } from "@expo/vector-icons";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { Dimensions, Platform } from "react-native";
// import { useLocalSearchParams } from 'expo-router';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import MessageHeader from "@/app/Components/MessageHeader";
// const { height } = Dimensions.get("window");

// export default function TabLayout() {
//     const { groupId, groupName, groupType } = useLocalSearchParams();
//     return (
//         <>
//             <MessageHeader
//                 onBackPress={() => navigation.goBack()}
//                 userName={groupName}
//                 timestamp=""
//                 onMenuPress={() => { }}
//                 profileImage='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR7jyJ8BtvuBGfBrjhuIlVMqk8tOWLYfOD8Q&s'
//             />


//             <Tabs
//                 screenOptions={{
//                     headerShown: false,
//                     tabBarShowLabel: true,
//                     tabBarActiveTintColor: "#694df0",
//                     tabBarInactiveTintColor: "#a0a0a0",
//                     tabBarLabelStyle: {
//                         fontSize: 11,
//                         fontWeight: "600",
//                         marginBottom: Platform.OS === "ios" ? 0 : 5,
//                     },
//                     tabBarStyle: {
//                         backgroundColor: "white",
//                         height: height * 0.09,
//                         borderTopWidth: 0.5,
//                         borderTopColor: "#dcdcdc",
//                         shadowColor: "#000",
//                         shadowOffset: { width: 0, height: -2 },
//                         shadowOpacity: 0.05,
//                         shadowRadius: 4,
//                         elevation: 10,
//                     },
//                 }}
//             >
//                 <Tabs.Screen
//                     name="groupchats"
//                     options={{
//                         tabBarLabel: "Chats",
//                         tabBarIcon: ({ focused }) => (
//                             <Ionicons
//                                 name={focused ? "chatbubble" : "chatbubble-outline"}
//                                 size={24}
//                                 color={focused ? "#694df0" : "#a0a0a0"}
//                             />
//                         ),
//                     }}
//                 />

//                 <Tabs.Screen
//                     name="feature1"
//                     options={{
//                         tabBarLabel: "Tasks",
//                         tabBarIcon: ({ focused }) => (
//                             <MaterialIcons
//                                 name={focused ? "task-alt" : "task-alt"}
//                                 size={24}
//                                 color={focused ? "#694df0" : "#a0a0a0"}
//                             />
//                         ),
//                     }}
//                 />

//                 <Tabs.Screen
//                     name="feature2"
//                     options={{
//                         tabBarLabel: "Meetings",
//                         tabBarIcon: ({ focused }) => (
//                             <MaterialIcons
//                                 name={focused ? "local-phone" : "local-phone"}
//                                 size={22}
//                                 color={focused ? "#694df0" : "#a0a0a0"}
//                             />
//                         ),
//                     }}
//                 />

//                 <Tabs.Screen
//                     name="feature3"
//                     options={{
//                         tabBarLabel: "Ideas",
//                         tabBarIcon: ({ focused }) => (
//                             <MaterialIcons
//                                 name={focused ? "lightbulb" : "lightbulb-outline"}
//                                 size={24}
//                                 color={focused ? "#694df0" : "#a0a0a0"}
//                             />
//                         ),
//                     }}
//                 />

//                 <Tabs.Screen
//                     name="feature4"
//                     options={{
//                         tabBarLabel: "Notes",
//                         tabBarIcon: ({ focused }) => (
//                             <MaterialIcons
//                                 name={focused ? "edit-note" : "edit-note"}
//                                 size={24}
//                                 color={focused ? "#694df0" : "#a0a0a0"}
//                             />
//                         ),
//                     }}
//                 />
//             </Tabs>

//         </>
//     );
// }


// import { Tabs } from "expo-router";
// import { useLocalSearchParams } from 'expo-router';
// import MessageHeader from "@/app/Components/MessageHeader";
// import { Dimensions, Platform } from "react-native";
// import { getTabsForGroupType } from '@/utils/tabConfigs';

// const { height } = Dimensions.get("window");

// export default function TabLayout() {
//     const { groupId, groupName, groupType } = useLocalSearchParams();

//     // Get the appropriate tabs for this group type
//     const tabsConfig = getTabsForGroupType(groupType);

//     return (
//         <>
//             <MessageHeader
//                 onBackPress={() => router.back()}
//                 userName={groupName}
//                 timestamp=""
//                 onMenuPress={() => { }}
//                 profileImage='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR7jyJ8BtvuBGfBrjhuIlVMqk8tOWLYfOD8Q&s'
//             />

//             <Tabs
//                 screenOptions={{
//                     headerShown: false,
//                     tabBarShowLabel: true,
//                     tabBarActiveTintColor: "#694df0",
//                     tabBarInactiveTintColor: "#a0a0a0",
//                     tabBarLabelStyle: {
//                         fontSize: 11,
//                         fontWeight: "600",
//                         marginBottom: Platform.OS === "ios" ? 0 : 5,
//                     },
//                     tabBarStyle: {
//                         backgroundColor: "white",
//                         height: height * 0.09,
//                         borderTopWidth: 0.5,
//                         borderTopColor: "#dcdcdc",
//                         shadowColor: "#000",
//                         shadowOffset: { width: 0, height: -2 },
//                         shadowOpacity: 0.05,
//                         shadowRadius: 4,
//                         elevation: 10,
//                     },
//                 }}
//             >
//                 {tabsConfig.map((tab) => (
//                     <Tabs.Screen
//                         key={tab.name}
//                         name={tab.name}
//                         options={{
//                             tabBarLabel: tab.label,
//                             tabBarIcon: ({ focused }) => tab.icon(focused),
//                         }}
//                     />
//                 ))}
//             </Tabs>
//         </>
//     );
// }









import { Tabs, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Dimensions, Platform } from "react-native";
import MessageHeader from "@/app/Components/MessageHeader";
import { useGroup } from "@/context/GroupContext";
const { height } = Dimensions.get("window");

export default function TabLayout() {
    // const { groupId, groupName, groupType } = useLocalSearchParams();
    const { groupData } = useGroup();

    console.log(`GroupID: ${groupData.groupId}, GroupName:  ${groupData.groupName}, GroupType${groupData.groupType}`);

    // Define tab labels and icons based on groupType
    const getTabConfig = () => {
        switch (groupData.groupType) {
            case "School":
                return [
                    { label: "Study calendar", icon: "calendar-month" },
                    { label: "Assignment tracker", icon: "assignment" },
                    { label: "Quiz zone", icon: "quiz" },
                    { label: "Teacher Chat", icon: "chat" },
                ];
            case "Home":
                return [
                    { label: "Shopping list", icon: "shopping-cart" },
                    { label: "Event calendar", icon: "event" },
                    { label: "Budgeting", icon: "account-balance-wallet" },
                    { label: "Chores", icon: "checklist" },
                ];
            case "Travel":
                return [
                    { label: "Itinerary", icon: "flight-takeoff" },
                    { label: "Checklist", icon: "checklist" },
                    { label: "Split expenses", icon: "paid" },
                    { label: "Docs Vault", icon: "folder" },
                ];
            case "Work":
                return [
                    { label: "Tasks", icon: "calendar-month" },
                    { label: "Meetings", icon: "assignment" },
                    { label: "Ideas", icon: "quiz" },
                    { label: "Notes", icon: "chat" },
                ]
            default:
                return [
                    { label: "Feature 1", icon: "apps" },
                    { label: "Feature 2", icon: "apps" },
                    { label: "Feature 3", icon: "apps" },
                    { label: "Feature 4", icon: "apps" },
                ];
        }
    };

    const tabConfig = getTabConfig();

    return (
        <>
            <MessageHeader
                onBackPress={() => navigation.goBack()}
                userName={groupData.groupName}
                timestamp=""
                onMenuPress={() => { }}
                profileImage='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR7jyJ8BtvuBGfBrjhuIlVMqk8tOWLYfOD8Q&s'
            />

            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: true,
                    tabBarActiveTintColor: "#694df0",
                    tabBarInactiveTintColor: "#a0a0a0",
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: "600",
                        marginBottom: Platform.OS === "ios" ? 0 : 5,
                    },
                    tabBarStyle: {
                        backgroundColor: "white",
                        height: height * 0.09,
                        borderTopWidth: 0.5,
                        borderTopColor: "#dcdcdc",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 10,
                    },
                }}
            >
                <Tabs.Screen
                    name="groupchats"
                    options={{
                        tabBarLabel: "Chats",
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? "chatbubble" : "chatbubble-outline"}
                                size={24}
                                color={focused ? "#694df0" : "#a0a0a0"}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="feature1"
                    options={{
                        tabBarLabel: tabConfig[0].label,
                        tabBarIcon: ({ focused }) => (
                            <MaterialIcons
                                name={tabConfig[0].icon}
                                size={24}
                                color={focused ? "#694df0" : "#a0a0a0"}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="feature2"
                    options={{
                        tabBarLabel: tabConfig[1].label,
                        tabBarIcon: ({ focused }) => (
                            <MaterialIcons
                                name={tabConfig[1].icon}
                                size={24}
                                color={focused ? "#694df0" : "#a0a0a0"}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="feature3"
                    options={{
                        tabBarLabel: tabConfig[2].label,
                        tabBarIcon: ({ focused }) => (
                            <MaterialIcons
                                name={tabConfig[2].icon}
                                size={24}
                                color={focused ? "#694df0" : "#a0a0a0"}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="feature4"
                    options={{
                        tabBarLabel: tabConfig[3].label,
                        tabBarIcon: ({ focused }) => (
                            <MaterialIcons
                                name={tabConfig[3].icon}
                                size={24}
                                color={focused ? "#694df0" : "#a0a0a0"}
                            />
                        ),
                    }}
                />
            </Tabs>
        </>
    );
}
