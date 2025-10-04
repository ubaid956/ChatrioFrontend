

import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import firebaseApp from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';

export default function Index() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // Runtime check: confirm whether native firebase app is initialized
  useEffect(() => {
    try {
      const appsAvailable = firebaseApp.apps ? firebaseApp.apps.length : undefined;
      console.log('Firebase native apps count:', appsAvailable);
      // if firebaseApp.app exists, log the default app name
      if (typeof firebaseApp.app === 'function') {
        try {
          const defaultName = firebaseApp.app().name;
          console.log('Default native firebase app name:', defaultName);
        } catch (e) {
          console.log('No default native firebase app available:', e.message);
        }
      }
    } catch (err) {
      console.warn('Error checking @react-native-firebase/app:', err.message || err);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const [token, userId, userData] = await Promise.all([
          AsyncStorage.getItem('userToken'),
          AsyncStorage.getItem('userId'),
          AsyncStorage.getItem('userData')
        ]);

        setRedirectTo(token && userId && userData ? '/(tabs)/chats' : '/Splash');
      } catch (error) {
        console.error('Error checking AsyncStorage', error);
        setRedirectTo('/Splash');
      }
    };

    checkAuth();
  }, []);

  if (!redirectTo) {
    return <ActivityIndicator size="large" />;
  }

  return <Redirect href={redirectTo} />;
}

