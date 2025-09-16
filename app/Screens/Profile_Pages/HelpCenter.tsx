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

import CustomHeader from '@/app/Components/Profile_Components/CustomHeader'
import Profile_cart from '@/app/Components/Profile_cart';

const { height, width } = Dimensions.get('window')
const HelpCenter = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView>


                <CustomHeader
                    title="Help Center"
                    onBackPress={() => router.back()}
                />
                <Image
                    source={require('../../../assets/images/chatrio_logo_trans.png')} style={[globalStyles.image, {


                    }]} resizeMode='contain' />


                <Text style={{ fontSize: "25", fontWeight: 'bold', textAlign: 'center', marginBottom: height * 0.03 }}>
                    How can we Help ?
                </Text>

                <Text style={{ marginLeft: width * 0.06, fontSize: "18" }}>
                    Helo Topics
                </Text>

                <View style={{ backgroundColor: '#f4f4f4' }}>
                    <Profile_cart
                        iconComponent={MaterialIcons}
                        text="Get Started"
                        iconName="flag" />

                    <Profile_cart
                        iconComponent={MaterialIcons}
                        text="Chats"
                        iconName="message" />
                    <Profile_cart
                        iconComponent={MaterialIcons}
                        text="Voice and Video Calls"
                        iconName="phone" />

                    <Profile_cart
                        iconComponent={MaterialIcons}
                        text="Accounts and Account Bans"
                        iconName="man" />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HelpCenter