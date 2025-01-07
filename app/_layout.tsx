import { useCallback, useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProfileProvider } from '~/context/ProfileContext';
import { ModalProvider } from '~/context/ModalContext';
import '../global.css';
import { getData } from '~/utils/storage';
import { UserProfile } from '~/types/profile';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [initialProfile, setInitialProfile] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    try {
      // Try to fetch the user profile
      const userProfile = await getData('userProfile');
      setInitialProfile(userProfile);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsReady(true);
      await SplashScreen.hideAsync();
    }
  }, []);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProfileProvider initialProfile={initialProfile}>
        <ModalProvider>
          <Slot />
        </ModalProvider>
      </ProfileProvider>
    </GestureHandlerRootView>
  );
}