// Get fresh push token from your current app installation
import { sendExpoPush } from './utils/push.js';

async function testMultipleTokens() {
    console.log('🔄 Testing with multiple potential tokens...');

    // Your current token
    const currentToken = 'ExponentPushToken[iDVXEEO3hot2VRP2k9uArf]';

    // Test with current token
    console.log('\n📱 Testing current token...');
    const result1 = await sendExpoPush(currentToken, {
        title: '🔄 Token Test 1',
        body: 'Testing current push token - ' + new Date().toLocaleTimeString(),
        data: { test: 'current_token' }
    });
    console.log('Current token result:', result1.success ? '✅ SUCCESS' : '❌ FAILED');

    console.log('\n📋 To get a fresh token:');
    console.log('1. Open your Chatrio app');
    console.log('2. Check the console logs for "COPY THIS TOKEN"');
    console.log('3. Update the test script with the new token');
    console.log('4. Re-run this test');

    // Instructions for app-side token retrieval
    console.log('\n🔧 Add this to your app temporarily (in App.js or main component):');
    console.log(`
import { registerForPushNotificationsAsync } from './utils/registerForPushNotificationsAsync';

// Add this in useEffect or component mount
registerForPushNotificationsAsync()
  .then(token => {
    console.log('🔑 FRESH TOKEN:', token);
    // You can also send this to your server for testing
  })
  .catch(console.error);
    `);
}

testMultipleTokens().catch(console.error);