import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { globalStyles } from '@/Styles/globalStyles';
import CustomHeader from '@/app/Components/Profile_Components/CustomHeader';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

const { height, width } = Dimensions.get('window');

const TermsAndPrivacy = ({ navigation }) => {
  const { t } = useTranslation();

  const handleBack = () => {
    navigation.goBack();
  };

  const openEmail = () => {
    Linking.openURL('mailto:support@chatrio.com');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

      <CustomHeader
        title={t('termsPrivacy.title')}
        onBackPress={() => router.back()}
      />
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}


        {/* Content */}
        <View style={styles.content}>
          {/* Introduction */}
          <Text style={styles.lastUpdated}>{t('termsPrivacy.lastUpdated')}</Text>

          <Text style={styles.sectionTitle}>{t('termsPrivacy.introduction')}</Text>
          <Text style={styles.sectionText}>
            {t('termsPrivacy.introText')}
          </Text>

          {/* Data Collection */}
          <Text style={styles.sectionTitle}>{t('termsPrivacy.dataCollection')}</Text>
          <Text style={styles.subSectionTitle}>{t('termsPrivacy.whatWeCollect')}</Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>{t('termsPrivacy.accountInfo')}</Text> {t('termsPrivacy.accountInfoDesc')}
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>{t('termsPrivacy.messagesMedia')}</Text> {t('termsPrivacy.messagesMediaDesc')}
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>{t('termsPrivacy.deviceInfo')}</Text> {t('termsPrivacy.deviceInfoDesc')}
            </Text>
          </View>

          <Text style={styles.subSectionTitle}>{t('termsPrivacy.howWeUse')}</Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>{t('termsPrivacy.provideServices')}</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>{t('termsPrivacy.authentication')}</Text>
          </View>

          {/* Data Security */}
          <Text style={styles.sectionTitle}>{t('termsPrivacy.dataSecurity')}</Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>{t('termsPrivacy.messages')}</Text> {t('termsPrivacy.messagesDesc')}
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>{t('termsPrivacy.encryption')}</Text> {t('termsPrivacy.encryptionDesc')}
            </Text>
          </View>

          {/* User Rights */}
          <Text style={styles.sectionTitle}>{t('termsPrivacy.userRights')}</Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>{t('termsPrivacy.accessCorrection')}</Text> {t('termsPrivacy.accessCorrectionDesc')}
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>{t('termsPrivacy.deletion')}</Text> {t('termsPrivacy.deletionDesc')}
            </Text>
          </View>

          {/* Prohibited Activities */}
          <Text style={styles.sectionTitle}>{t('termsPrivacy.prohibited')}</Text>
          <Text style={styles.sectionText}>
            {t('termsPrivacy.prohibitedText')}
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, styles.prohibited]}>❌</Text>
            <Text style={[styles.sectionText, styles.prohibitedText]}>
              {t('termsPrivacy.harassment')}
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, styles.prohibited]}>❌</Text>
            <Text style={[styles.sectionText, styles.prohibitedText]}>
              {t('termsPrivacy.spamming')}
            </Text>
          </View>

          {/* Contact */}
          <Text style={styles.sectionTitle}>{t('termsPrivacy.contact')}</Text>
          <Text style={styles.sectionText}>
            {t('termsPrivacy.contactText')}
          </Text>
          <TouchableOpacity onPress={openEmail}>
            <Text style={styles.emailText}>{t('termsPrivacy.email')}</Text>
          </TouchableOpacity>

          {/* Acceptance */}
          <Text style={styles.acceptanceText}>
            {t('termsPrivacy.acceptance')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: height * 0.05,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: width * 0.03,
  },
  headerTitle: {
    fontSize: width * 0.045,
    color: '#37475A',
  },
  content: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  lastUpdated: {
    fontSize: width * 0.03,
    color: '#666',
    textAlign: 'right',
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: width * 0.04,
    fontWeight: '700',
    color: '#37475A',
    marginTop: height * 0.03,
    marginBottom: height * 0.01,
  },
  subSectionTitle: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#37475A',
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  sectionText: {
    fontSize: width * 0.035,
    lineHeight: height * 0.025,
    color: '#666',
    marginBottom: height * 0.01,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: height * 0.005,
    alignItems: 'flex-start',
  },
  bullet: {
    marginRight: width * 0.02,
    color: '#666',
  },
  boldText: {
    fontWeight: '600',
    color: '#37475A',
  },
  prohibited: {
    color: '#ff4444',
  },
  prohibitedText: {
    color: '#ff4444',
  },
  emailText: {
    fontSize: width * 0.035,
    color: '#0758C2',
    marginVertical: height * 0.01,
  },
  acceptanceText: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#37475A',
    marginTop: height * 0.04,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default TermsAndPrivacy;