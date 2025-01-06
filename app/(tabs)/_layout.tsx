import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import ProfileFormModal from '~/components/profile/ProfileFormModal';
import { StyleSheet, Text } from 'react-native';
import { useProfile } from '~/context/ProfileContext';
import { UserProfile } from '~/types/profile';
import FloatingActionButtonGroup from '~/components/FloatingActionButtonGroup'; 

const TabsLayout = () => {
  const {
    profile,
    loading,
    isProfileFormVisible,
    showProfileForm,
    hideProfileForm,
    saveUser,
    updateProfile,
  } = useProfile();

  const handleSave = (newProfile: UserProfile) => {
    saveUser(newProfile);
    hideProfileForm();
  };

  const handleUpdate = (updatedProfile: UserProfile) => {
    updateProfile(updatedProfile);
    hideProfileForm();
  };

  useEffect(() => {
    if (!loading && !profile) {
      showProfileForm();
    }
  }, [profile, loading]);

  return (
    <>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>🏠</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="body-fat"
          options={{
            title: 'Body Fat',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>📊</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="PhotoProgress"
          options={{
            title: 'Photo Progress',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>📊</Text>
            ),
          }}
        />
      </Tabs>

      {/* Use the FloatingActionButtonGroup component */}
      <FloatingActionButtonGroup />

      {/* only show the modal if no profile exists */}
      <ProfileFormModal
        visible={isProfileFormVisible}
        onSave={handleSave}
        onUpdate={handleUpdate}
        onClose={hideProfileForm}
        profile={profile}
      />
    </>
  );
};

export default TabsLayout;