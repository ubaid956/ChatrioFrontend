import {
    ScrollView,
    Text,

    View,
    Image,
    Dimensions,
    SafeAreaView
} from 'react-native';
import { globalStyles } from '@/Styles/globalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import CustomHeader from '@/app/Components/Profile_Components/CustomHeader'
import Profile_cart from '@/app/Components/Profile_cart';

const { height, width } = Dimensions.get('window')
const HelpCenter = () => {
    const { t } = useTranslation();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView>


                <CustomHeader
                    title={t('helpCenter.title')}
                    onBackPress={() => router.back()}
                />
                <Image
                    source={require('../../../assets/images/chatrio_logo_trans.png')} style={[globalStyles.image, {


                    }]} resizeMode='contain' />


                <Text style={{ fontSize: "25", fontWeight: 'bold', textAlign: 'center', marginBottom: height * 0.03 }}>
                    {t('helpCenter.subtitle')}
                </Text>

                <Text style={{ marginLeft: width * 0.06, fontSize: "18" }}>
                    {t('helpCenter.helpTopics')}
                </Text>

                <View style={{ backgroundColor: '#f4f4f4' }}>
                    <Profile_cart
                        iconComponent={MaterialIcons}
                        text={t('helpCenter.getStarted')}
                        iconName="flag" />

                    <Profile_cart
                        iconComponent={MaterialIcons}
                        text={t('helpCenter.chats')}
                        iconName="message" />
                    <Profile_cart
                        iconComponent={MaterialIcons}
                        text={t('helpCenter.voiceVideoCalls')}
                        iconName="phone" />

                    <Profile_cart
                        iconComponent={MaterialIcons}
                        text={t('helpCenter.accountsBans')}
                        iconName="man" />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HelpCenter