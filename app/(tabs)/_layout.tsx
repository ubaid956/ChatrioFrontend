import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from "expo-router";
import { Dimensions, Platform } from "react-native";
import { useTranslation } from "react-i18next"; // Import i18n hook

const { height } = Dimensions.get("window");

export default function TabLayout() {
  const { t } = useTranslation(); // Access translations

  return (
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
        name="chats"
        options={{
          tabBarLabel: t("tabs.chats"), // translated label
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
        name="groups"
        options={{
          tabBarLabel: t("tabs.groups"), // translated label
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account-group" : "account-group-outline"}
              size={24}
              color={focused ? "#694df0" : "#a0a0a0"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: t("tabs.profile"), // translated label
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name={focused ? "user-alt" : "user"}
              size={20}
              color={focused ? "#694df0" : "#a0a0a0"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
