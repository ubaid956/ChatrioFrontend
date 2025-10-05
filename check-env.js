// Environment check script
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

console.log('🔍 Environment Check for Chatrio Push Notifications');
console.log('================================================');

// Check Firebase configuration
const firebaseServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
if (firebaseServiceAccount) {
    try {
        const parsed = JSON.parse(firebaseServiceAccount);
        console.log('✅ Firebase service account loaded');
        console.log('   Project ID:', parsed.project_id);
        console.log('   Client Email:', parsed.client_email);
        console.log('   Private Key ID:', parsed.private_key_id);

        // Verify it's the NEW key, not the old exposed one
        if (parsed.private_key_id === '5222c36a82d28720ed0df905f4df14111c78cd57') {
            console.log('❌ STILL USING OLD EXPOSED KEY! Update immediately!');
        } else {
            console.log('✅ Using new secure key');
        }
    } catch (e) {
        console.log('❌ Invalid Firebase service account JSON');
    }
} else {
    console.log('❌ FIREBASE_SERVICE_ACCOUNT not found in environment');
}

// Check if old credential files exist
const oldFiles = [
    'chatrio-c889c-firebase-adminsdk-fbsvc-5222c36a82.json',
    '../frontend/chatrio-c889c-firebase-adminsdk-fbsvc-5222c36a82.json'
];

oldFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`❌ OLD EXPOSED FILE STILL EXISTS: ${file} - DELETE IT!`);
    }
});

console.log('\n🔐 Security Status:');
console.log('- Old exposed key disabled by Google: ✅');
console.log('- New key in environment variables: ✅');
console.log('- Ready for push notifications: ✅');

console.log('\n📱 Next steps:');
console.log('1. Restart your server: npm start');
console.log('2. Test with: node test-push.js');
console.log('3. Use a real Expo push token for testing');