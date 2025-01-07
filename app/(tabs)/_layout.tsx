import React, { useEffect } from 'react';
import { Tabs, useRouter, useFocusEffect } from 'expo-router';
import { Text } from 'react-native';
import { useProfile } from '~/context/ProfileContext';
import FloatingActionButtonGroup from '~/components/FloatingActionButtonGroup';
import { StyleSheet } from 'react-native';

const TabsLayout = () => {
  const { profile, loading } = useProfile();
  const router = useRouter();

  useFocusEffect(() => {
    if (!profile && !loading) {
      router.replace('/profile');
    }
  });

  return (
    <>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: TabIcon('🏠') }} />
        <Tabs.Screen name="body-fat" options={{ title: 'Body Fat', tabBarIcon: TabIcon('📊') }} />
        <Tabs.Screen name="PhotoProgress" options={{ title: 'Photo Progress', tabBarIcon: TabIcon('📷') }} />
      </Tabs>

      <FloatingActionButtonGroup />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

const TabIcon = (icon: string) => ({ color, size }: { color: string; size: number }) => (
  <Text style={{ color, fontSize: size }}>{icon}</Text>
);

export default TabsLayout;