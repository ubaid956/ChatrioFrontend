// // import {
// //   View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView
// // } from 'react-native';
// // import React, { useEffect, useState } from 'react';
// // import { globalStyles } from '@/Styles/globalStyles';
// // import FeatureCard from '@/app/Components/Group_Features/FeatureCard';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import axios from 'axios';
// // import { useGroup } from '@/context/GroupContext';
// // import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
// // import { router } from 'expo-router';
// // import HomeCard from '@/app/Components/Group_Features/Home/HomeCard';
// // import DocumentCard from '@/app/Components/Group_Features/Travel/DocumentCard';


// // const { width, height } = Dimensions.get('window');


// // const feature4 = () => {
// //   const [notes, setNotes] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [chores, setChores] = useState([]);
// //   const [choresLoading, setChoresLoading] = useState(true);
// //   const [documents, setDocuments] = useState([]);
// //   const [docsLoading, setDocsLoading] = useState(true);
// //   const { groupData } = useGroup();
// //   // useEffect(() => {
// //   //   fetchNotes();
// //   // }, []);
// //   useEffect(() => {
// //     if (groupData.groupType === "Work") {
// //       fetchNotes();
// //     } else if (groupData.groupType === "Home") {
// //       fetchChores();
// //     } else if (groupData.groupType === "Travel") {
// //       fetchDocuments();
// //     }
// //   }, []);


// //   const fetchNotes = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem('userToken');
// //       if (!token) {
// //         console.error('No token found');
// //         setLoading(false);
// //         return;
// //       }

// //       const response = await axios.get(`https://chatrio-backend.onrender.com/api/work/note/${groupId}`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       setNotes(response.data);
// //     } catch (error) {
// //       console.error('Failed to fetch notes:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //   const fetchChores = async () => {
// //     try {
// //       setChoresLoading(true);
// //       const token = await AsyncStorage.getItem('userToken');
// //       if (!token) {
// //         console.error("No token found");
// //         setChoresLoading(false);
// //         return;
// //       }

// //       const res = await axios.get(
// //         `https://chatrio-backend.onrender.com/api/home/chore/${groupData.groupId}`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       setChores(res.data);
// //     } catch (err) {
// //       console.error("Failed to fetch chores:", err);
// //     } finally {
// //       setChoresLoading(false);
// //     }
// //   };

// //   const fetchDocuments = async () => {
// //     try {
// //       setDocsLoading(true);
// //       const token = await AsyncStorage.getItem("userToken");
// //       if (!token) {
// //         console.error("No token found");
// //         setDocsLoading(false);
// //         return;
// //       }

// //       const res = await axios.get(
// //         `https://chatrio-backend.onrender.com/api/travel/document/${groupData.groupId}`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );
// //       setDocuments(res.data);
// //     } catch (err) {
// //       console.error("Failed to fetch documents:", err);
// //     } finally {
// //       setDocsLoading(false);
// //     }
// //   };

// //   const handleDocumentClick = (url) => {
// //     router.push({
// //       pathname: "/Screens/GroupPages/TravelPages/DocumentViewer",
// //       params: { fileUrl: url },
// //     });
// //   };

// //   return (
// //     <View style={[globalStyles.container]}>
// //       {groupData.groupType === "Work" && (
// //         <>
// //           <View style={globalStyles.groupHeader}>
// //             <Text style={globalStyles.groupTitle}>Notes</Text>
// //           </View>



// //           {loading ? (
// //             <View style={styles.center}>
// //               <ActivityIndicator size="large" color="#0000ff" />
// //             </View>
// //           ) : notes.length === 0 ? (
// //             <View style={styles.center}>
// //               <Text style={styles.noText}>No notes found</Text>
// //             </View>
// //           ) : (
// //             <View style={styles.gridContainer}>
// //               {notes.map((note, index) => (
// //                 <FeatureCard
// //                   key={note._id}
// //                   title={note.title}
// //                   description={note.content}
// //                   variant={(index % 3) + 1}
// //                 />
// //               ))}
// //             </View>
// //           )}
// //         </>
// //       )}

// //       {groupData.groupType === "Home" && (
// //         <>
// //           <View style={globalStyles.groupHeader}>
// //             <Text style={globalStyles.groupTitle}>Chores</Text>
// //             <TouchableOpacity>
// //               <FontAwesome5 name="filter" size={24} color="#694df0" />
// //             </TouchableOpacity>
// //           </View>

// //           {choresLoading ? (
// //             <View style={styles.center}>
// //               <ActivityIndicator size="large" color="#0000ff" />
// //             </View>
// //           ) : chores.length === 0 ? (
// //             <View style={styles.center}>
// //               <Text style={styles.noText}>No chores found</Text>
// //             </View>
// //           ) : (
// //             <View>
// //               {chores.map((chore) => (
// //                 <HomeCard
// //                   key={chore._id}
// //                   type="chores"
// //                   title={chore.task}
// //                   user={chore.assignedTo.name} // Replace with dynamic user if needed
// //                   date={new Date(chore.dueDate).toLocaleDateString('en-US', {
// //                     month: 'short',
// //                     day: 'numeric',
// //                   })}
// //                   completed={chore.isCompleted}
// //                   onToggleCompleted={() => { }}
// //                   onEdit={() => { }}
// //                   onDelete={() => { }}
// //                 />
// //               ))}
// //             </View>
// //           )}


// //         </>
// //       )}

// //       {groupData.groupType === "Travel" && (
// //         <>
// //           <View style={globalStyles.groupHeader}>
// //             <Text style={globalStyles.groupTitle}>Documents</Text>
// //             <TouchableOpacity>
// //               <FontAwesome5 name="filter" size={24} color="#694df0" />
// //             </TouchableOpacity>
// //           </View>

// //           {docsLoading ? (
// //             <View style={styles.center}>
// //               <ActivityIndicator size="large" color="#0000ff" />
// //             </View>
// //           ) : documents.length === 0 ? (
// //             <View style={styles.center}>
// //               <Text style={styles.noText}>No documents found</Text>
// //             </View>
// //           ) : (
// //             <ScrollView contentContainerStyle={[styles.gridContainer, { marginHorizontal: width * 0.02 }]}>
// //               {documents.map((doc) => (
// //                 <TouchableOpacity key={doc._id} onPress={() => handleDocumentClick(doc.fileUrl)}>
// //                   <DocumentCard
// //                     title={doc.title}
// //                     date={new Date(doc.createdAt).toLocaleDateString('en-US', {
// //                       month: 'short',
// //                       day: 'numeric',
// //                     })}
// //                     uploadedBy="Ubaid Ansari"
// //                     thumbnail={doc.fileUrl}
// //                   />
// //                 </TouchableOpacity>

// //               ))}
// //             </ScrollView>
// //           )}
// //         </>
// //       )}

// //     </View>
// //   );
// // };

// // export default feature4;

// // const styles = StyleSheet.create({
// //   gridContainer: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'space-between',
// //     paddingTop: 10,
// //     marginHorizontal: width * 0.05,
// //   },
// //   center: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingVertical: 40,
// //   },
// //   noText: {
// //     fontSize: 16,
// //     color: '#666',
// //   },
// // });

// import {
//   View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView,
//   FlatList
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { globalStyles } from '@/Styles/globalStyles';
// import FeatureCard from '@/app/Components/Group_Features/FeatureCard';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useGroup } from '@/context/GroupContext';
// import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
// import { router } from 'expo-router';
// import HomeCard from '@/app/Components/Group_Features/Home/HomeCard';
// import DocumentCard from '@/app/Components/Group_Features/Travel/DocumentCard';
// import MessageComponent from '@/app/Components/MessagesComonent';

// const { width, height } = Dimensions.get('window');

// const feature4 = () => {
//   const [notes, setNotes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [chores, setChores] = useState([]);
//   const [choresLoading, setChoresLoading] = useState(true);
//   const [documents, setDocuments] = useState([]);
//   const [docsLoading, setDocsLoading] = useState(true);
//   const [teachers, setTeachers] = useState([]);
//   const [teachersLoading, setTeachersLoading] = useState(true);
//   const { groupData } = useGroup();

//   useEffect(() => {
//     if (groupData.groupType === "Work") {
//       fetchNotes();
//     } else if (groupData.groupType === "Home") {
//       fetchChores();
//     } else if (groupData.groupType === "Travel") {
//       fetchDocuments();
//     } else if (groupData.groupType === "School") {
//       fetchTeachers();
//     }
//   }, [groupData.groupId]);

//   const fetchNotes = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         console.error('No token found');
//         setLoading(false);
//         return;
//       }

//       const response = await axios.get(`https://chatrio-backend.onrender.com/api/work/note/${groupData.groupId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setNotes(response.data);
//     } catch (error) {
//       console.error('Failed to fetch notes:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchChores = async () => {
//     try {
//       setChoresLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         console.error("No token found");
//         setChoresLoading(false);
//         return;
//       }

//       const res = await axios.get(
//         `https://chatrio-backend.onrender.com/api/home/chore/${groupData.groupId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setChores(res.data);
//     } catch (err) {
//       console.error("Failed to fetch chores:", err);
//     } finally {
//       setChoresLoading(false);
//     }
//   };

//   const fetchDocuments = async () => {
//     try {
//       setDocsLoading(true);
//       const token = await AsyncStorage.getItem("userToken");
//       if (!token) {
//         console.error("No token found");
//         setDocsLoading(false);
//         return;
//       }

//       const res = await axios.get(
//         `https://chatrio-backend.onrender.com/api/travel/document/${groupData.groupId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setDocuments(res.data);
//     } catch (err) {
//       console.error("Failed to fetch documents:", err);
//     } finally {
//       setDocsLoading(false);
//     }
//   };

//   const fetchTeachers = async () => {
//     try {
//       setTeachersLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) {
//         console.error("No token found");
//         setTeachersLoading(false);
//         return;
//       }

//       const res = await axios.get(
//         `https://chatrio-backend.onrender.com/api/groups/${groupData.groupId}/users`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Filter out teachers from group members
//       const teacherMembers = res.data.users.filter(user => user.role === 'teacher');
//       setTeachers(teacherMembers);
//     } catch (err) {
//       console.error("Failed to fetch teachers:", err);
//     } finally {
//       setTeachersLoading(false);
//     }
//   };

//   const handleDocumentClick = (url) => {
//     router.push({
//       pathname: "/Screens/GroupPages/TravelPages/DocumentViewer",
//       params: { fileUrl: url },
//     });
//   };

//   const handleTeacherPress = (teacher) => {
//     router.push({
//       pathname: '/Screens/ChatMessage',
//       params: { 
//         userId: teacher._id,
//         isPrivateChat: true,
//         groupId: groupData.groupId 
//       },
//     });
//   };

//   return (
//     <View style={[globalStyles.container]}>
//       {groupData.groupType === "Work" && (
//         <>
//           <View style={globalStyles.groupHeader}>
//             <Text style={globalStyles.groupTitle}>Notes</Text>
//           </View>

//           {loading ? (
//             <View style={styles.center}>
//               <ActivityIndicator size="large" color="#0000ff" />
//             </View>
//           ) : notes.length === 0 ? (
//             <View style={styles.center}>
//               <Text style={styles.noText}>No notes found</Text>
//             </View>
//           ) : (
//             <View style={styles.gridContainer}>
//               {notes.map((note, index) => (
//                 <FeatureCard
//                   key={note._id}
//                   title={note.title}
//                   description={note.content}
//                   variant={(index % 3) + 1}
//                 />
//               ))}
//             </View>
//           )}
//         </>
//       )}

//       {groupData.groupType === "Home" && (
//         <>
//           <View style={globalStyles.groupHeader}>
//             <Text style={globalStyles.groupTitle}>Chores</Text>
//             <TouchableOpacity>
//               <FontAwesome5 name="filter" size={24} color="#694df0" />
//             </TouchableOpacity>
//           </View>

//           {choresLoading ? (
//             <View style={styles.center}>
//               <ActivityIndicator size="large" color="#0000ff" />
//             </View>
//           ) : chores.length === 0 ? (
//             <View style={styles.center}>
//               <Text style={styles.noText}>No chores found</Text>
//             </View>
//           ) : (
//             <View>
//               {chores.map((chore) => (
//                 <HomeCard
//                   key={chore._id}
//                   type="chores"
//                   title={chore.task}
//                   user={chore.assignedTo.name}
//                   date={new Date(chore.dueDate).toLocaleDateString('en-US', {
//                     month: 'short',
//                     day: 'numeric',
//                   })}
//                   completed={chore.isCompleted}
//                   onToggleCompleted={() => { }}
//                   onEdit={() => { }}
//                   onDelete={() => { }}
//                 />
//               ))}
//             </View>
//           )}
//         </>
//       )}

//       {groupData.groupType === "Travel" && (
//         <>
//           <View style={globalStyles.groupHeader}>
//             <Text style={globalStyles.groupTitle}>Documents</Text>
//             <TouchableOpacity>
//               <FontAwesome5 name="filter" size={24} color="#694df0" />
//             </TouchableOpacity>
//           </View>

//           {docsLoading ? (
//             <View style={styles.center}>
//               <ActivityIndicator size="large" color="#0000ff" />
//             </View>
//           ) : documents.length === 0 ? (
//             <View style={styles.center}>
//               <Text style={styles.noText}>No documents found</Text>
//             </View>
//           ) : (
//             <ScrollView contentContainerStyle={[styles.gridContainer, { marginHorizontal: width * 0.02 }]}>
//               {documents.map((doc) => (
//                 <TouchableOpacity key={doc._id} onPress={() => handleDocumentClick(doc.fileUrl)}>
//                   <DocumentCard
//                     title={doc.title}
//                     date={new Date(doc.createdAt).toLocaleDateString('en-US', {
//                       month: 'short',
//                       day: 'numeric',
//                     })}
//                     uploadedBy="Ubaid Ansari"
//                     thumbnail={doc.fileUrl}
//                   />
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           )}
//         </>
//       )}

//       {groupData.groupType === "School" && (
//         <>
//           <View style={globalStyles.groupHeader}>
//             <Text style={globalStyles.groupTitle}>Teacher Chat</Text>
//           </View>

//           {teachersLoading ? (
//             <View style={styles.center}>
//               <ActivityIndicator size="large" color="#0000ff" />
//             </View>
//           ) : teachers.length === 0 ? (
//             <View style={styles.center}>
//               <Text style={styles.noText}>No teachers in this group</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={teachers}
//               keyExtractor={(item) => item._id}
//               renderItem={({ item }) => (
//                 <MessageComponent
//                   name={item.name}
//                   message={item.currentStatus || "Teacher"}
//                   time=""
//                   unreadCount={0}
//                   profileImage={item.pic}
//                   onPress={() => handleTeacherPress(item)}
//                 />
//               )}
//             />
//           )}
//         </>
//       )}
//     </View>
//   );
// };

// export default feature4;

// const styles = StyleSheet.create({
//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingTop: 10,
//     marginHorizontal: width * 0.05,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   noText: {
//     fontSize: 16,
//     color: '#666',
//   },
// });

import {
  View, Text, StyleSheet, Dimensions, ActivityIndicator, FlatList, SafeAreaView
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { globalStyles } from '@/Styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useGroup } from '@/context/GroupContext';
import { router } from 'expo-router';
import MessageComponent from '@/app/Components/MessagesComonent';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { groupStyle } from '@/Styles/groupStyle';

const { width } = Dimensions.get('window');

const feature4 = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { groupData } = useGroup();

  useEffect(() => {
    fetchTeachers();
  }, [groupData.groupId]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `https://chatrio-backend.onrender.com/api/groups/${groupData.groupId}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Filter out teachers from group members
      const teacherMembers = res.data.users.filter(user => user.role === 'teacher');
      setTeachers(teacherMembers);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherPress = (teacher) => {
    router.push({
      pathname: '/Screens/ChatMessage',
      params: {
        userId: teacher._id,
        isPrivateChat: true,
        groupId: groupData.groupId,
        userName: teacher.name,
        userPic: teacher.pic
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader
        title={`${groupData.groupName}`}
        onBackPress={() => router.back()}
      />


      {
        loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#694df0" />
          </View>
        ) : teachers.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.noText}>No teachers in this group</Text>
            <Text style={styles.hintText}>Teachers will appear here once they join the group</Text>
          </View>
        ) : (
          <FlatList
            data={teachers}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <MessageComponent
                name={item.name}
                message={item.currentStatus || "Teacher"}
                time=""
                unreadCount={0}
                profileImage={item.pic}
                onPress={() => handleTeacherPress(item)}
                showStatus={true}
              />
            )}
          />
        )
      }
    </SafeAreaView >
  );
};

export default feature4;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  hintText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  listContainer: {
    paddingTop: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 20,
  },
});