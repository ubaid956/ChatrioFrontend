// firebaseConfig.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyAfSGotrAISQlpvFwklBtZ1v_ST-tRhgyY',
    authDomain: 'chatrio-c889c.firebaseapp.com',
    projectId: 'chatrio-c889c',
    storageBucket: 'chatrio-c889c.firebasestorage.app',
    messagingSenderId: '250145305468',
    appId: '1:250145305468:android:e348583a6ae326ef3b6af9',
};

// Initialize Firebase only if no apps exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);