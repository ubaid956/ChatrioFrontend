import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    TextInput,
    Alert,
    SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { router, useLocalSearchParams } from 'expo-router';
import CustomButton from '@/app/Components/CustomButton';
import { globalStyles } from '@/Styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const About = () => {
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const currentAbout = params.currentAbout || '';

    const [selectedAbout, setSelectedAbout] = useState(currentAbout);
    const [isEditing, setIsEditing] = useState(false);
    const [customAbout, setCustomAbout] = useState('');
    const [updating, setUpdating] = useState(false);

    const aboutOptions = [
        { key: 'available', text: t('about.available') },
        { key: 'busy', text: t('about.busy') },
        { key: 'atSchool', text: t('about.atSchool') },
        { key: 'atMovies', text: t('about.atMovies') },
        { key: 'atWork', text: t('about.atWork') },
        { key: 'batteryDying', text: t('about.batteryDying') },
        { key: 'whatsappOnly', text: t('about.whatsappOnly') },
        { key: 'inMeeting', text: t('about.inMeeting') },
        { key: 'atGym', text: t('about.atGym') },
        { key: 'sleeping', text: t('about.sleeping') },
        { key: 'urgentOnly', text: t('about.urgentOnly') }
    ];

    const onSave = async (newAbout) => {
        setUpdating(true);
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            if (!userToken) throw new Error('User not authenticated');

            const response = await axios.put(
                'https://chatrio-backend.onrender.com/api/auth/users/profile',
                { bio: newAbout },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const updatedUser = {
                ...(JSON.parse(await AsyncStorage.getItem('userData'))),
                bio: newAbout,
            };

            await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
            Alert.alert(t('about.success'), t('about.aboutUpdated'));
            router.back(); // Navigate back after save
        } catch (error) {
            console.error('About update error:', error);
            Alert.alert(t('about.error'), t('about.updateFailed'));
        } finally {
            setUpdating(false);
        }
    };

    const handleSave = () => {
        if (isEditing && customAbout.trim()) {
            onSave(customAbout);
        } else if (selectedAbout) {
            onSave(selectedAbout);
        }
        setIsEditing(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <CustomHeader
                title={t('about.title')}
                onBackPress={() => router.back()}
            />

            <ScrollView
                style={globalStyles.container}
                contentContainerStyle={styles.contentContainer}
            >
                <View style={styles.content}>
                    {/* Current About */}
                    <View style={styles.currentStatusContainer}>
                        <Text style={styles.currentStatusLabel}>{t('about.currentlySet')}</Text>
                        <Text style={styles.currentStatusText}>
                            {currentAbout || t('about.notSet')}
                        </Text>
                    </View>

                    {isEditing ? (
                        <View style={styles.editContainer}>
                            <Text style={styles.sectionTitle}>{t('about.addAbout')}</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={t('about.customStatusPlaceholder')}
                                value={customAbout}
                                onChangeText={setCustomAbout}
                                autoFocus={true}
                            />
                            <View style={styles.editButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setIsEditing(false)}
                                >
                                    <Text style={styles.cancelButtonText}>{t('about.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={handleSave}
                                    disabled={updating || !customAbout.trim()}
                                >
                                    {updating ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <Text style={styles.saveButtonText}>{t('about.save')}</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.sectionTitle}>{t('about.selectAbout')}</Text>

                            {aboutOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.key}
                                    style={[
                                        styles.optionItem,
                                        selectedAbout === option.text && styles.selectedOption
                                    ]}
                                    onPress={() => setSelectedAbout(option.text)}
                                >
                                    <Text style={styles.optionText}>{option.text}</Text>
                                    {selectedAbout === option.text && (
                                        <MaterialIcons name="check" size={20} color="#0758C2" />
                                    )}
                                </TouchableOpacity>
                            ))}

                            <CustomButton
                                style={styles.editButton}
                                onPress={() => setIsEditing(true)}
                                title={t('about.addCustomAbout')}
                                login
                            />

                            <View style={{ marginBottom: height * 0.015 }} />

                            <CustomButton
                                title={
                                    updating ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        t('about.saveAbout')
                                    )
                                }
                                onPress={handleSave}
                                disabled={updating || !selectedAbout}
                            />
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        paddingBottom: height * 0.05,
    },
    content: {
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.02,
    },
    currentStatusContainer: {
        marginBottom: height * 0.03,
        paddingBottom: height * 0.02,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    currentStatusLabel: {
        fontSize: width * 0.035,
        color: '#666',
        marginBottom: height * 0.005,
    },
    currentStatusText: {
        fontSize: width * 0.04,
        color: '#37475A',
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: width * 0.04,
        fontWeight: '700',
        color: '#37475A',
        marginTop: height * 0.02,
        marginBottom: height * 0.015,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.03,
        borderBottomWidth: 1,
        borderBottomColor: '#f4f4f4',
    },
    selectedOption: {
        backgroundColor: '#f0f7ff',
    },
    optionText: {
        fontSize: width * 0.035,
        color: '#37475A',
    },
    editContainer: {
        marginBottom: height * 0.03,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: width * 0.04,
        fontSize: width * 0.035,
        marginBottom: height * 0.02,
    },
    editButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        padding: height * 0.015,
        alignItems: 'center',
        marginRight: width * 0.03,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: '#37475A',
        fontSize: width * 0.035,
        fontWeight: '500',
    },
    editButton: {
        padding: height * 0.015,
        alignItems: 'center',
        marginVertical: height * 0.02,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#0758C2',
    },
    editButtonText: {
        color: '#0758C2',
        fontSize: width * 0.035,
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: '#0758C2',
        padding: height * 0.015,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: height * 0.02,
    },
    saveButtonText: {
        color: 'white',
        fontSize: width * 0.035,
        fontWeight: 'bold',
    },
});

export default About;
