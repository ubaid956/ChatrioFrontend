import { View, Text, Image, Dimensions } from 'react-native';
import React from 'react';
import CustomButton from '../Components/CustomButton';
import { globalStyles } from '@/Styles/globalStyles';
import { router } from "expo-router";
import { useTranslation } from 'react-i18next';

const { height, width } = Dimensions.get('window');

const Welcome = () => {
    const { t } = useTranslation();

    return (
        <View style={globalStyles.container}>
            <Image
                source={require('../../assets/images/chatrio_logo_trans.png')}
                style={[globalStyles.image, { height: height * 0.3, width: width * 0.5 }]}
            />

            <Text style={globalStyles.title}>{t('welcome')}</Text>

            <Text style={globalStyles.subtitle}>{t('adaptive_platform')}</Text>

            <Text style={globalStyles.subtitle}>
                {'\u2022'} {t('smart_ui')}{"\n\n"}
                {'\u2022'} {t('chat_seamlessly')}{"\n\n"}
                {'\u2022'} {t('flexible_groups')}
            </Text>

            <View style={{ marginTop: height * 0.1 }}>
                <CustomButton title={t('create_account')} onPress={() => router.push('Screens/Signup')} />
            </View>

            <View style={{ marginTop: height * 0.016 }}>
                <CustomButton title={t('login')} onPress={() => router.push('/Screens/Login')} login={true} />
            </View>
        </View>
    );
};

export default Welcome;
