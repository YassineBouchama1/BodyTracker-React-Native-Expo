import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import ProfileFormModal from '~/components/profile/ProfileFormModal';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useProfile } from '~/context/ProfileContext';
import { UserProfile } from '~/types/profile';
import { Ionicons } from '@expo/vector-icons';

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

  {/* Floating Button */}
  <View style={styles.floatingButtonContainer}>

  <TouchableOpacity
    style={styles.floatingButton}
    onPress={()=>showProfileForm()}
  >
    <Ionicons name="add" size={24} color="#fff" />
  </TouchableOpacity>
</View>

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

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
    gap: 10, 
  },
  floatingButton: {
    position: 'absolute',
    bottom: 70, 
    right: 20, 
    backgroundColor: '#6a11cb',
    width: 56, 
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
export default TabsLayout;