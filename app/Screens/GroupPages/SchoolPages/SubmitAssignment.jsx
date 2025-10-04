import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Modal } from 'react-native';
import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { useLocalSearchParams, router } from 'expo-router';
import { globalStyles } from '@/Styles/globalStyles';
import Entypo from '@expo/vector-icons/Entypo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



const { width, height } = Dimensions.get('window');

const SubmitAssignment = () => {
    const { id, title, description, dueDate, creatorName } = useLocalSearchParams();
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [showWebPicker, setShowWebPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);


    const formattedDate = new Date(dueDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const handleSubmitAssignment = async () => {
        try {
            if (attachedFiles.length === 0) {
                alert("Please attach a file before submitting.");
                return;
            }

            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                alert("Unauthorized. Please login again.");
                return;
            }

            const formData = new FormData();

            // Convert file to correct formData format
            const file = attachedFiles[0];
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.type || 'application/octet-stream'
            });

            const response = await axios.post(
                `https://chatrio-backend.onrender.com/api/school/assignment/${id}/submit`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                alert("Assignment submitted successfully!");
                setAttachedFiles([]); // clear files
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Submission error:", error.response?.data || error.message);
            alert("Error submitting assignment.");
        }
    };

    const htmlPicker = `
    <!DOCTYPE html>
    <html>
      <body style="display:flex;justify-content:center;align-items:center;height:100vh;">
        <input type="file" id="fileInput" />
        <script>
          const input = document.getElementById('fileInput');
          input.addEventListener('change', () => {
            const file = input.files[0];
            if (file) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                name: file.name,
                type: file.type,
                size: file.size
              }));
            }
          });
        </script>
      </body>
    </html>
  `;

    const handleFileSelect = (event) => {
        const file = JSON.parse(event.nativeEvent.data);
        setAttachedFiles(prev => [...prev, file]);
        setShowWebPicker(false);
    };

    return (
        <ScrollView style={globalStyles.container}>
            <CustomHeader
                title="Submit Assignment"
                onBackPress={() => router.back()}
                rightComponent={true}
                onRightPress={handleSubmitAssignment} // 👈 pass your function here
            />
            <View style={styles.card}>
                <Text style={styles.heading}>{title}</Text>
                <Text style={styles.label}>Due Date</Text>
                <Text style={styles.info}>{formattedDate}</Text>

                <Text style={styles.label}>Instructions</Text>
                <Text style={styles.info}>{description || "No instructions provided."}</Text>

                <Text style={styles.label}>Created By</Text>
                <Text style={styles.info}>{creatorName || "Unknown"}</Text>

                <Text style={styles.label}>Reference Material</Text>
                <TouchableOpacity style={styles.materialBox}>
                    <Text style={styles.materialText}>Attachment Placeholder</Text>
                </TouchableOpacity>

                <Text style={styles.label}>My Work</Text>
                {attachedFiles.length > 0 && (
                    <View style={{ marginTop: 12 }}>
                        {attachedFiles.map((file, index) => (
                            <TouchableOpacity key={index} onPress={() => setSelectedFile(file)} style={styles.filePreview}>
                                <Entypo name="attachment" size={18} color="#694df0" />
                                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                                <TouchableOpacity onPress={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}>
                                    <Entypo name="cross" size={18} color="red" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}

                    </View>
                )}

                <View style={styles.workButtons}>
                    <TouchableOpacity style={styles.btn} onPress={() => setShowWebPicker(true)}>
                        <Entypo name="attachment" size={18} color="#694df0" />
                        <Text style={styles.attachText}>Attach</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btn}>
                        <Entypo name="plus" size={18} color="#694df0" />
                        <Text style={styles.attachText}>New</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Points</Text>
                <Text style={styles.info}>No points</Text>
            </View>

            {showWebPicker && (
                <Modal animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalInner}>
                            <WebView
                                originWhitelist={['*']}
                                source={{ html: htmlPicker }}
                                onMessage={handleFileSelect}
                            />
                            <TouchableOpacity onPress={() => setShowWebPicker(false)} style={styles.closeBtn}>
                                <Text style={{ color: '#fff' }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
            {selectedFile && (
                <Modal animationType="fade" transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.fileDetailModal}>
                            <Text style={styles.heading}>File Info</Text>
                            <Text style={styles.info}>Name: {selectedFile.name}</Text>
                            <Text style={styles.info}>Type: {selectedFile.type}</Text>
                            <Text style={styles.info}>Size: {(selectedFile.size / 1024).toFixed(2)} KB</Text>

                            <TouchableOpacity onPress={() => setSelectedFile(null)} style={styles.closeBtn}>
                                <Text style={{ color: '#fff' }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

        </ScrollView>
    );
};

export default SubmitAssignment;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 20,
        marginHorizontal: width * 0.01,
    },
    heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' },
    label: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 4, color: 'grey' },
    info: { fontSize: 14, color: 'black' },
    materialBox: {
        backgroundColor: '#eef2ff',
        borderRadius: 8,
        padding: 12,
        marginTop: 6,
    },
    materialText: { color: '#000', fontWeight: '500' },
    workButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        padding: width * 0.01,
    },
    attachText: {
        color: '#694df0',
        fontWeight: 'bold',
        marginLeft: width * 0.01,
    },
    filePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        justifyContent: 'space-between',
    },
    fileName: { flex: 1, marginLeft: 10, color: '#333', fontSize: 13 },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalInner: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        height: 200,
    },
    closeBtn: {
        padding: 10,
        backgroundColor: '#694df0',
        alignItems: 'center',
    },
    fileDetailModal: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 10,
        gap: 10,
    },

});
