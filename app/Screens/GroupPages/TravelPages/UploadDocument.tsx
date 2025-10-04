// /** UploadDocument.js */
// import React, { useState } from 'react';
// import {
//   View, Text, ScrollView, TextInput, TouchableOpacity,
//   ActivityIndicator, Alert, Dimensions, Modal
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
// import { router } from 'expo-router';
// import { globalStyles } from '@/Styles/globalStyles';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import CustomButton from '@/app/Components/CustomButton';
// import { groupStyle } from '@/Styles/groupStyle';
// import { useGroup } from '@/context/GroupContext';
// import Entypo from '@expo/vector-icons/Entypo';

// const { width } = Dimensions.get('window');

// const UploadDocument = () => {
//   const [title, setTitle] = useState('');
//   const [file, setFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showWebPicker, setShowWebPicker] = useState(false);
//   const [showFileInfo, setShowFileInfo] = useState(false);
//   const { groupData } = useGroup();
//   const groupId = groupData.groupId;

//   const htmlPicker = `
//     <!DOCTYPE html>
//     <html>
//       <body style="display:flex;justify-content:center;align-items:center;height:100vh;">
//         <input type="file" id="fileInput" />
//         <script>
//           const input = document.getElementById('fileInput');
//           input.addEventListener('change', () => {
//             const file = input.files[0];
//             if (file) {
//               window.ReactNativeWebView.postMessage(JSON.stringify({
//                 name: file.name,
//                 type: file.type,
//                 size: file.size
//               }));
//             }
//           });
//         </script>
//       </body>
//     </html>
//   `;

//   const handleFileFromWebView = (event) => {
//     const fileData = JSON.parse(event.nativeEvent.data);
//     setFile({
//       uri: '',
//       name: fileData.name,
//       type: fileData.type,
//       size: fileData.size
//     });
//     setShowWebPicker(false);
//   };

//   const onSubmit = async () => {
//     if (!file || !title) {
//       return alert('Please provide both title and file.');
//     }

//     try {
//       setIsLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return alert('User not authenticated');

//       const formData = new FormData();
//       formData.append('title', title);
//       formData.append('file', {
//         uri: file.uri,
//         name: file.name,
//         type: file.type || 'application/octet-stream'
//       });

//       const response = await axios.post(
//         `https://chatrio-backend.onrender.com/api/travel/document/${groupId}`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         Alert.alert('Success', 'Document uploaded successfully.');
//         router.back();
//       } else {
//         Alert.alert('Error', 'Upload failed.');
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', 'Something went wrong.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={globalStyles.container}>
//       <CustomHeader title="Send Document" onBackPress={() => router.back()} />
//       <ScrollView contentContainerStyle={groupStyle.container}>
//         <View style={groupStyle.inputWrapper}>
//           <Text style={groupStyle.label}>Title</Text>
//           <TextInput
//             placeholder="Document Title"
//             value={title}
//             onChangeText={setTitle}
//             style={groupStyle.input}
//           />
//         </View>

//         {/* File Preview */}
//         {file && (
//           <TouchableOpacity
//             style={{
//               backgroundColor: '#eef2ff',
//               borderRadius: 8,
//               padding: 12,
//               marginBottom: 12,
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center'
//             }}
//             onPress={() => setShowFileInfo(true)}
//           >
//             <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
//               <Entypo name="attachment" size={18} color="#694df0" />
//               <Text numberOfLines={1} style={{ marginLeft: 10, flex: 1 }}>
//                 {file.name}
//               </Text>
//             </View>
//             <TouchableOpacity onPress={() => setFile(null)}>
//               <Entypo name="cross" size={18} color="red" />
//             </TouchableOpacity>
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity
//           onPress={() => setShowWebPicker(true)}
//           style={[groupStyle.dateInput, { marginBottom: 20 }]}
//         >
//           <Text style={{ color: file ? '#000' : '#888' }}>
//             {file ? 'Change File' : 'Pick a file to upload'}
//           </Text>
//         </TouchableOpacity>

//         <CustomButton
//           title={isLoading ? <ActivityIndicator color="white" /> : 'Upload Document'}
//           onPress={onSubmit}
//           disabled={isLoading}
//           large
//         />
//       </ScrollView>

//       {/* File Picker WebView */}
//       {showWebPicker && (
//         <Modal animationType="slide" transparent={true}>
//           <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }}>
//             <View style={{ marginHorizontal: 20, backgroundColor: 'white', borderRadius: 10, overflow: 'hidden', height: 200 }}>
//               <WebView source={{ html: htmlPicker }} onMessage={handleFileFromWebView} />
//               <TouchableOpacity onPress={() => setShowWebPicker(false)} style={{ backgroundColor: '#694df0', padding: 10, alignItems: 'center' }}>
//                 <Text style={{ color: '#fff' }}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       )}

//       {/* File Info Modal */}
//       {showFileInfo && (
//         <Modal animationType="fade" transparent={true}>
//           <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
//             <View style={{ backgroundColor: 'white', marginHorizontal: 20, padding: 20, borderRadius: 10, gap: 10 }}>
//               <Text style={{ fontSize: 18, fontWeight: 'bold' }}>File Info</Text>
//               <Text>Name: {file.name}</Text>
//               <Text>Type: {file.type}</Text>
//               <Text>Size: {(file.size / 1024).toFixed(2)} KB</Text>
//               <TouchableOpacity onPress={() => setShowFileInfo(false)} style={{ backgroundColor: '#694df0', padding: 10, alignItems: 'center', marginTop: 10 }}>
//                 <Text style={{ color: '#fff' }}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       )}
//     </View>
//   );
// };

// export default UploadDocument;
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, Dimensions, Modal
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { router, useLocalSearchParams } from 'expo-router';
import { globalStyles } from '@/Styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomButton from '@/app/Components/CustomButton';
import { groupStyle } from '@/Styles/groupStyle';
import { useGroup } from '@/context/GroupContext';
import Entypo from '@expo/vector-icons/Entypo';

const { width } = Dimensions.get('window');

const UploadDocument = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFileInfo, setShowFileInfo] = useState(false);
  const { groupData } = useGroup();
  const groupId = groupData.groupId;
  const { context } = useLocalSearchParams(); // 'travel' or 'school'

  // Dynamic title based on context
  const screenTitle = context === 'school' ? 'Upload Resource' : 'Send Document';

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) return;

      const pickedFile = result.assets[0];
      setFile({
        uri: pickedFile.uri,
        name: pickedFile.name,
        type: pickedFile.mimeType || 'application/octet-stream',
        size: pickedFile.size,
      });
    } catch (error) {
      console.error('Document Picker Error:', error);
      Alert.alert('Error', 'Failed to pick document.');
    }
  };

  const onSubmit = async () => {
    if (!file || !title) {
      return alert('Please provide both title and file.');
    }

    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return alert('User not authenticated');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type || 'application/octet-stream',
      });

      // ✅ Set the correct endpoint based on context
      const endpoint =
        context === 'school'
          ? `https://chatrio-backend.onrender.com/api/school/uploadResource/${groupId}`
          : `https://chatrio-backend.onrender.com/api/travel/document/${groupId}`;

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', `${screenTitle} uploaded successfully.`);
        router.back();
      } else {
        Alert.alert('Error', 'Upload failed.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <CustomHeader title={screenTitle} onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={groupStyle.container}>
        <View style={groupStyle.inputWrapper}>
          <Text style={groupStyle.label}>Title</Text>
          <TextInput
            placeholder="Document Title"
            placeholderTextColor="#999"

            value={title}
            onChangeText={setTitle}
            style={groupStyle.input}
          />
        </View>

        {file && (
          <TouchableOpacity
            style={{
              backgroundColor: '#eef2ff',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onPress={() => setShowFileInfo(true)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Entypo name="attachment" size={18} color="#694df0" />
              <Text numberOfLines={1} style={{ marginLeft: 10, flex: 1 }}>
                {file.name}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setFile(null)}>
              <Entypo name="cross" size={18} color="red" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={pickDocument}
          style={[groupStyle.dateInput, { marginBottom: 20 }]}
        >
          <Text style={{ color: file ? '#000' : '#888' }}>
            {file ? 'Change File' : 'Pick a file to upload'}
          </Text>
        </TouchableOpacity>

        <CustomButton
          title={isLoading ? <ActivityIndicator color="white" /> : `Upload ${context === 'school' ? 'Resource' : 'Document'}`}
          onPress={onSubmit}
          disabled={isLoading}
          large
        />
      </ScrollView>

      {/* File Info Modal */}
      {showFileInfo && (
        <Modal animationType="fade" transparent={true}>
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: 'white', marginHorizontal: 20, padding: 20, borderRadius: 10, gap: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>File Info</Text>
              <Text>Name: {file.name}</Text>
              <Text>Type: {file.type}</Text>
              <Text>Size: {(file.size / 1024).toFixed(2)} KB</Text>
              <TouchableOpacity onPress={() => setShowFileInfo(false)} style={{ backgroundColor: '#694df0', padding: 10, alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: '#fff' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default UploadDocument;
