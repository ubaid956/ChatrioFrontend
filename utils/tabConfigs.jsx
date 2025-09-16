// utils/tabConfigs.js
import { MaterialIcons } from '@expo/vector-icons';

export const groupTypeTabs = {
  Work: [
    {
      name: "groupchats",
      label: "Chats",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "chat" : "chat-bubble-outline"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "tasks",
      label: "Tasks",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "task-alt" : "task"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "meetings",
      label: "Meetings",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "video-call" : "videocam"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "ideas",
      label: "Ideas",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "lightbulb" : "lightbulb-outline"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "notes",
      label: "Notes",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "edit-note" : "notes"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    }
  ],
  School: [
    {
      name: "groupchats",
      label: "Chats",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "chat" : "chat-bubble-outline"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "calendar",
      label: "Calendar",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "calendar-month" : "calendar-today"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "assignments",
      label: "Assignments",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "assignment" : "assignment-ind"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "quizzes",
      label: "Quizzes",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "quiz" : "help-outline"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "resources",
      label: "Resources",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "folder" : "folder-open"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    }
  ],
  Home: [
    {
      name: "groupchats",
      label: "Chats",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "chat" : "chat-bubble-outline"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "shopping",
      label: "Shopping",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "shopping-cart" : "add-shopping-cart"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "chores",
      label: "Chores",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "checklist" : "checklist-rtl"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "events",
      label: "Events",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "event" : "event-available"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "budget",
      label: "Budget",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "attach-money" : "monetization-on"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    }
  ],
  Travel: [
    {
      name: "groupchats",
      label: "Chats",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "chat" : "chat-bubble-outline"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "itinerary",
      label: "Itinerary",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "map" : "map-outlined"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "checklist",
      label: "Checklist",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "checklist" : "checklist-rtl"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "expenses",
      label: "Expenses",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "receipt" : "receipt-long"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    },
    {
      name: "documents",
      label: "Documents",
      icon: (focused) => (
        <MaterialIcons
          name={focused ? "description" : "description"}
          size={24}
          color={focused ? "#694df0" : "#a0a0a0"}
        />
      )
    }
  ]
};

export const getTabsForGroupType = (groupType) => {
  return groupTypeTabs[groupType] || groupTypeTabs.Work; // Default to Work if type not found
};