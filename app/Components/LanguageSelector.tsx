import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../i18n';

const { width, height } = Dimensions.get('window');

const LanguageSelector = () => {
    const [selectedLang, setSelectedLang] = useState(i18n.language || 'en');

    useEffect(() => {
        // Load saved language on mount
        const fetchLanguage = async () => {
            const storedLang = await AsyncStorage.getItem('appLanguage');
            if (storedLang) {
                setSelectedLang(storedLang);
                i18n.changeLanguage(storedLang);
            }
        };
        fetchLanguage();
    }, []);

    const changeLanguage = async (lang) => {
        setSelectedLang(lang);
        i18n.changeLanguage(lang);
        await AsyncStorage.setItem('appLanguage', lang); // Save selection
    };

    return (
        <View
            style={{
                width: width * 0.5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: height * 0.02,
                alignItems: 'center',
            }}
        >
            <TouchableOpacity onPress={() => changeLanguage('en')}>
                <Text style={{ color: selectedLang === 'en' ? '#694df0' : 'black' }}>
                    English
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => changeLanguage('ar')}>
                <Text style={{ color: selectedLang === 'ar' ? '#694df0' : 'black' }}>
                    العربية
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LanguageSelector;
