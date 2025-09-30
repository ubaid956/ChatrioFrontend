import { globalStyles } from '@/Styles/globalStyles';
import { Feather, MaterialIcons } from '@expo/vector-icons';

import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Modal,
  SafeAreaView, Platform
} from 'react-native';
import CustomButton from '../Components/CustomButton';
import Profile_cart from '../Components/Profile_cart';
import HomeHeader from '../Components/HomeHeader';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useNavigation, useFocusEffect } from "expo-router";
import mime from 'mime';
import AboutModal from '../Components/Profile_Components/AboutModal';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import i18n, { setAppLanguage } from '../../i18n/index';



const { width, height } = Dimensions.get('window');
const Profile = () => {
  const { t } = useTranslation(); // ✅ Hook for translations
  const navigation = useNavigation()
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [updatingAbout, setUpdatingAbout] = useState(false);

  // Add this function to handle about update
  const updateAbout = async (newAbout) => {
    setUpdatingAbout(true);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('User not authenticated');
      }

      const response = await axios.put(
        'https://37prw4st-5000.asse.devtunnels.ms/api/auth/users/profile',
        { bio: newAbout },
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the user data in state and AsyncStorage
      const updatedUser = { ...user, bio: newAbout };
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

      Alert.alert(t('success'), t('profile.successAbout'));
      setAboutModalVisible(false);
    } catch (error) {
      console.error('About update error:', error);
      Alert.alert(t('error'), t('profile.errorAbout'));
    } finally {
      setUpdatingAbout(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData', 'userId']);
      router.push('/Screens/Login');
    } catch (error) {
      console.error(t('profile.errorLogout'), error);
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      const loadUserData = async () => {
        try {
          const userDataString = await AsyncStorage.getItem('userData');
          if (userDataString) {
            const userData = JSON.parse(userDataString);
            setUser(userData);
          }
        } catch (error) {
          console.log('Failed to load user data:', error);
        } finally {
          setLoading(false);
        }
      };
      loadUserData();
    }, [])
  );

  const uploadImage = async (imageUri) => {
    setUploading(true);
    try {
      console.log('Upload started for URI:', imageUri);

      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('User not authenticated');
      }

      // Validate image URI
      if (!imageUri || typeof imageUri !== 'string') {
        throw new Error('Invalid image URI');
      }

      // Create FormData for file upload
      const formData = new FormData();

      // Simple file object for maximum compatibility
      const fileObject = {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      };

      formData.append('profilePic', fileObject as any);

      console.log('FormData created, sending request...');

      const response = await axios.put(
        'https://37prw4st-5000.asse.devtunnels.ms/api/auth/users/profile',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }
      );

      console.log('Upload successful:', response.data);

      // Update the user data in state and AsyncStorage
      if (response.data && response.data.user && response.data.user.pic) {
        const updatedUser = { ...user, pic: response.data.user.pic };
        setUser(updatedUser);
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        Alert.alert('Success', 'Profile picture updated successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Profile picture upload error:', error);
      Alert.alert('Error', `Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    try {
      console.log('pickImage called, Platform:', Platform.OS);

      // For iOS, use a more cautious approach
      if (Platform.OS === 'ios') {
        // Show alert first to prepare user
        Alert.alert(
          'Select Profile Picture',
          'This will open your photo library. Please ensure you have granted photo access permission.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Continue',
              onPress: async () => {
                try {
                  await openImageLibrary();
                } catch (error) {
                  console.error('iOS image picker error:', error);
                  Alert.alert('Error', 'Failed to open photo library. Please check your permissions in Settings.');
                }
              },
            },
          ]
        );
      } else {
        // Android - direct approach
        await openImageLibrary();
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to open image picker. Please try again.');
    }
  };

  const openImageLibrary = async () => {
    try {
      console.log('Starting image library process...');

      // Check current permission status first
      const currentStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
      console.log('Current permission status:', currentStatus);

      let finalStatus = currentStatus.status;

      // Only request permission if not already granted
      if (currentStatus.status !== 'granted') {
        console.log('Requesting new permissions...');

        try {
          // Wrap permission request in additional try-catch for iOS
          const result = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Permission request timeout'));
            }, 8000);

            ImagePicker.requestMediaLibraryPermissionsAsync()
              .then((permissionResult) => {
                clearTimeout(timeout);
                resolve(permissionResult);
              })
              .catch((error) => {
                clearTimeout(timeout);
                reject(error);
              });
          });

          finalStatus = result.status;
          console.log('Permission request result:', result);
        } catch (permissionError) {
          console.error('Permission request failed:', permissionError);
          Alert.alert(
            'Permission Error',
            'Unable to request photo library permission. Please go to Settings > Privacy & Security > Photos and allow access for this app.',
            [
              { text: 'OK', style: 'default' }
            ]
          );
          return;
        }
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Photo library access is required to select a profile picture. Would you like to grant permission?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => console.log('User cancelled permission request')
            },
            {
              text: 'Grant Permission',
              onPress: async () => {
                try {
                  console.log('User wants to grant permission, requesting again...');
                  const retryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                  console.log('Retry permission result:', retryResult);

                  if (retryResult.status === 'granted') {
                    // Permission granted, try to open image library again
                    console.log('Permission granted, opening image library...');
                    const imageResult = await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ImagePicker.MediaTypeOptions.Images,
                      allowsEditing: false,
                      quality: 0.1,
                      base64: false,
                      exif: false,
                      allowsMultipleSelection: false,
                    });

                    if (!imageResult.canceled && imageResult.assets && imageResult.assets.length > 0) {
                      const selectedImage = imageResult.assets[0];
                      if (selectedImage.uri && selectedImage.uri.length > 0) {
                        setTimeout(async () => {
                          try {
                            await uploadImage(selectedImage.uri);
                          } catch (uploadError) {
                            console.error('Upload error:', uploadError);
                            Alert.alert('Error', 'Failed to upload image. Please try again.');
                          }
                        }, 500);
                      }
                    }
                  } else {
                    Alert.alert(
                      'Permission Denied',
                      'Photo library access is required to update your profile picture. Please go to Settings > Privacy & Security > Photos and allow access for this app.',
                      [{ text: 'OK' }]
                    );
                  }
                } catch (error) {
                  console.error('Permission retry error:', error);
                  Alert.alert('Error', 'Failed to request permission. Please try again.');
                }
              }
            }
          ]
        );
        return;
      }

      console.log('Opening image library...');

      // Ultra-minimal configuration for maximum iOS compatibility
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.1,
        base64: false,
        exif: false,
        allowsMultipleSelection: false,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        console.log('Selected image:', selectedImage);

        if (selectedImage.uri && selectedImage.uri.length > 0) {
          console.log('Starting upload...');
          setTimeout(async () => {
            try {
              await uploadImage(selectedImage.uri);
            } catch (uploadError) {
              console.error('Upload error:', uploadError);
              Alert.alert('Error', 'Failed to upload image. Please try again.');
            }
          }, 500);
        } else {
          Alert.alert('Error', 'Invalid image selected. Please try again.');
        }
      }
    } catch (error) {
      console.error('Image library error:', error);
      Alert.alert('Error', `Failed to open photo library: ${error.message}`);
    }
  };


  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t('profile.noUserData')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Profile Top Section */}
      <ScrollView>

        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage} disabled={uploading}>
            {uploading ? (
              <View style={[styles.profileImage, styles.uploadingContainer]}>
                <ActivityIndicator size="small" color="#007bff" />
              </View>
            ) : (
              <Image
                source={
                  !user.pic || user.pic === 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                    ? require('../../assets/images/user.jpg')
                    : { uri: user.pic }
                }
                style={styles.profileImage}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.name}>{user.name}</Text>
        </View>

        <View style={{ backgroundColor: 'white' }}>
          <Text style={{ marginLeft: width * 0.04, fontSize: 16, marginTop: height * 0.02, color: '#6b7280' }}>
            {t('profile.accountInformation')}
          </Text>
          <View style={{ backgroundColor: '#f4f4f4' }}>
            <Profile_cart iconComponent={MaterialIcons} iconName="mail" text={user.email} />
            <Profile_cart iconComponent={MaterialIcons} iconName="phone" text={user.phone || t('profile.notProvided')} />
            <Profile_cart
              iconComponent={MaterialIcons}
              iconName="info"
              text={user.bio || t('profile.notProvided')}
              onPress={() => router.push('/Screens/Profile_Pages/About')}
            />
            <Profile_cart iconComponent={MaterialIcons} iconName="location-pin" text={user.location || t('profile.notProvided')} />
          </View>
        </View>


        <View style={{ backgroundColor: 'white', marginTop: height * 0.03, marginBottom: height * 0.02 }}>
          <Text style={{ marginLeft: width * 0.04, fontSize: 16, marginTop: height * 0.02, color: '#6b7280' }}>
            {t('profile.settingsSupport')}
          </Text>
          <View style={{ backgroundColor: '#f4f4f4' }}>
            <Profile_cart
              iconComponent={MaterialIcons}
              iconName="language"
              text={t('profile.language')}
              onPress={() => setLanguageModalVisible(true)}
            />

            <Profile_cart iconComponent={MaterialIcons} iconName="help" text={t('profile.helpCenter')} onPress={() => router.push('/Screens/Profile_Pages/HelpCenter')} />
            <Profile_cart iconComponent={MaterialIcons} iconName="privacy-tip" text={t('profile.termsPrivacy')} onPress={() => router.push('/Screens/Profile_Pages/TermsAndPrivacy')} />
          </View>
        </View>

        <CustomButton
          title={loading ? <ActivityIndicator size="small" color="white" /> : t('profile.logout')}
          onPress={handleLogout}
          disabled={loading}
        />
      </ScrollView>
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t('profile.selectLanguage')}</Text>

            {/* English */}
            <TouchableOpacity
              style={styles.languageButton}
              onPress={async () => {
                await setAppLanguage('en');
                setLanguageModalVisible(false);
              }}
            >
              <Text
                style={[
                  styles.languageText,
                  i18n.language === 'en' && styles.selectedLanguage
                ]}
              >
                English
              </Text>
            </TouchableOpacity>

            {/* Arabic */}
            <TouchableOpacity
              style={styles.languageButton}
              onPress={async () => {
                await setAppLanguage('ar');
                setLanguageModalVisible(false);
              }}
            >
              <Text
                style={[
                  styles.languageText,
                  i18n.language === 'ar' && styles.selectedLanguage
                ]}
              >
                العربية
              </Text>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.cancelText}>{t('profile.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: height * 0.02,
    position: 'relative',
    // marginTop: height * 0.01,
    marginBottom: height * 0.01,
    paddingVertical: height * 0.02,
    // backgroundColor:'red'

  },
  editIconContainer: {
    position: 'absolute',
    top: 8,
    right: 18,
    backgroundColor: '#e6f0ff',
    padding: 8,
    borderRadius: 8,
  },
  profileImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 999,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  roleBadge: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginVertical: 5,
  },
  roleText: {
    color: '#007bff',
    fontWeight: '500',
  },
  subtitle: {
    color: '#666',
    marginBottom: 10,
  },
  statsRow: {

    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: height * 0.01,
    backgroundColor: 'white',
    paddingVertical: height * 0.015
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#555',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    color: '#333',
  },
  newBadge: {
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  uploadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  languageButton: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguage: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 10,
  },
  cancelText: {
    color: '#ff4444',
    fontWeight: '600',
    fontSize: 16,
  },

});

export default Profile;
