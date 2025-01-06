import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateBMI } from '../utils/calculations';
import { UserProfile, BMIRecord } from '~/types/profile';
import { getData, storeData, removeData } from '~/utils/storage';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // fun to save or create a user profile
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

  // funcs to update the profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!profile) return;

    setLoading(true); 
    try {
      // only add to BMI history if weight or height changed
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
        updatedAt: new Date().toISOString() // Update the timestamp
      };

      await storeData('userProfile', updatedProfile);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false); 
    }
  };

  // func to delete the profile
  const deleteProfile = async () => {
    setLoading(true); 
    try {
      await removeData('userProfile');
      setProfile(null); // Reset profile state
    } catch (error) {
      console.error('Failed to delete profile:', error);
    } finally {
      setLoading(false); 
    }
  };

  // load current profile information
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

  useEffect(() => {
    loadProfile();
  }, []);

  // get current BMI without saving
  const getCurrentBMI = () => {
    if (!profile) return null;
    return calculateBMI(profile.weight, profile.height);
  };

  // ge BMI history
  const getBMIHistory = () => {
    return profile?.bmiHistory || [];
  };

  // gt BMI trend (bring last 2 measurements)
  const getBMITrend = () => {
    if (!profile?.bmiHistory.length) return null;

    const history = profile.bmiHistory;
    if (history.length < 2) return 'initial';

    const latest = history[history.length - 1].bmi;
    const previous = history[history.length - 2].bmi;

    if (latest > previous) return 'increasing';
    if (latest < previous) return 'decreasing';
    return 'stable';
  };

  return {
    profile,
    loading,
    saveUser,
    updateProfile,
    deleteProfile,
    getCurrentBMI,
    getBMIHistory,
    getBMITrend
  };
};