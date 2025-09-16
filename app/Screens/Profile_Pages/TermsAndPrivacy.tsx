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

const { height, width } = Dimensions.get('window');

const TermsAndPrivacy = ({ navigation }) => {
  const handleBack = () => {
    navigation.goBack();
  };

  const openEmail = () => {
    Linking.openURL('mailto:support@chatrio.com');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

      <CustomHeader
        title="Terms & Privacy Policy"
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
          <Text style={styles.lastUpdated}>Last Updated: June 2024</Text>

          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.sectionText}>
            Welcome to Chatrio! This Terms & Privacy Policy outlines how we handle your data, your rights, and the rules governing your use of our chat application. By using Chatrio, you agree to these terms.
          </Text>

          {/* Data Collection */}
          <Text style={styles.sectionTitle}>2. Data Collection & Usage</Text>
          <Text style={styles.subSectionTitle}>What We Collect:</Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>Account Information:</Text> Name, email, phone number (optional), profile picture.
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>Messages & Media:</Text> Text, images, videos, and files shared in chats.
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>Device Information:</Text> IP address, device type, OS version for security and analytics.
            </Text>
          </View>

          <Text style={styles.subSectionTitle}>How We Use Your Data:</Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>To provide and improve our services.</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>For authentication and account security.</Text>
          </View>

          {/* Data Security */}
          <Text style={styles.sectionTitle}>3. Data Storage & Security</Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>Messages:</Text> Stored securely in encrypted databases.
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>End-to-End Encryption:</Text> Private chats are encrypted, but group chats may not be fully E2EE.
            </Text>
          </View>

          {/* User Rights */}
          <Text style={styles.sectionTitle}>4. User Rights & Controls</Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>Access & Correction:</Text> You can view and edit your profile data anytime.
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.sectionText}>
              <Text style={styles.boldText}>Deletion:</Text> You can delete your account, which removes your personal data.
            </Text>
          </View>

          {/* Prohibited Activities */}
          <Text style={styles.sectionTitle}>5. Prohibited Activities</Text>
          <Text style={styles.sectionText}>
            You agree not to use Chatrio for:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, styles.prohibited]}>❌</Text>
            <Text style={[styles.sectionText, styles.prohibitedText]}>
              Harassment, hate speech, or illegal content.
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, styles.prohibited]}>❌</Text>
            <Text style={[styles.sectionText, styles.prohibitedText]}>
              Spamming or phishing attempts.
            </Text>
          </View>

          {/* Contact */}
          <Text style={styles.sectionTitle}>8. Contact Us</Text>
          <Text style={styles.sectionText}>
            For questions or data requests:
          </Text>
          <TouchableOpacity onPress={openEmail}>
            <Text style={styles.emailText}>📧 support@chatrio.com</Text>
          </TouchableOpacity>

          {/* Acceptance */}
          <Text style={styles.acceptanceText}>
            By using Chatrio, you confirm that you have read and agree to these terms.
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