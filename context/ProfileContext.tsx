import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateBMI } from '../utils/calculations';
import { UserProfile, BMIRecord } from '~/types/profile';
import { getData, storeData, removeData } from '~/utils/storage';
import { AppState, AppStateStatus } from 'react-native';

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  loadProfile:()=>void;
  isProfileFormVisible: boolean;
  showProfileForm: () => void;
  hideProfileForm: () => void;
  saveUser: (userData: UserProfile) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  deleteProfile: () => Promise<void>;
  getCurrentBMI: () => number | null;
  getBMIHistory: () => BMIRecord[];
  getBMITrend: () => 'increasing' | 'decreasing' | 'stable' | 'initial' | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isProfileFormVisible, setIsProfileFormVisible] = useState<boolean>(false);

  // Load profile data when the app starts or comes to the foreground
  const loadProfile = async () => {
    setLoading(true);
    try {
      const savedProfile = await getData('userProfile');
      if (savedProfile) {
        setProfile(savedProfile);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Track app state changes (foreground/background)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Refresh profile data when the app comes to the foreground
        loadProfile();
      }
    };

    // Add event listener for app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Load profile data when the app starts
    loadProfile();

    // Clean up the event listener
    return () => {
      subscription.remove();
    };
  }, []);

  // Show the profile form modal
  const showProfileForm = () => {
    console.log('Showing profile form modal'); // Debug log
    setIsProfileFormVisible(true);
  };

  // Hide the profile form modal
  const hideProfileForm = () => {
    setIsProfileFormVisible(false);
  };




  // Save user profile
  const saveUser = async (userData: UserProfile) => {
    setLoading(true);
    try {
      const bmiResult = calculateBMI(userData.weight, userData.height);
      const newProfile: UserProfile = {
        ...userData,
        bmiHistory: [{
          date: new Date().toISOString(),
          weight: userData.weight,
          height: userData.height,
          bmi: bmiResult
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await storeData('userProfile', newProfile);
      setProfile(newProfile);
    } catch (error) {
      console.error('Failed to save user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!profile) return;

    setLoading(true);
    try {
      let bmiHistory = [...profile.bmiHistory];
      if (data.weight !== profile.weight || data.height !== profile.height) {
        const newWeight = data.weight || profile.weight;
        const newHeight = data.height || profile.height;
        const bmiResult = calculateBMI(newWeight, newHeight);

        bmiHistory.push({
          date: new Date().toISOString(),
          weight: newWeight,
          height: newHeight,
          bmi: bmiResult
        });
      }

      const updatedProfile = {
        ...profile,
        ...data,
        bmiHistory,
        updatedAt: new Date().toISOString()
      };

      await storeData('userProfile', updatedProfile);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete user profile
  const deleteProfile = async () => {
    setLoading(true);
    try {
      await removeData('userProfile');
      setProfile(null);
    } catch (error) {
      console.error('Failed to delete profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get current BMI
  const getCurrentBMI = () => {
    if (!profile) return null;
    return calculateBMI(profile.weight, profile.height);
  };

  // Get BMI history
  const getBMIHistory = () => {
    return profile?.bmiHistory || [];
  };

  // Get BMI trend
  const getBMITrend = () => {
    if (!profile?.bmiHistory.length) return null;

    const history = profile.bmiHistory;
    if (history.length < 2) return 'initial'; // Include 'initial'

    const latest = history[history.length - 1].bmi;
    const previous = history[history.length - 2].bmi;

    if (latest > previous) return 'increasing';
    if (latest < previous) return 'decreasing';
    return 'stable';
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        loadProfile,
        isProfileFormVisible,
        showProfileForm,
        hideProfileForm,
        saveUser,
        updateProfile,
        deleteProfile,
        getCurrentBMI,
        getBMIHistory,
        getBMITrend
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};