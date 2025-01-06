import React, { useState } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, RefreshControl, Text } from 'react-native';
import BodyFatChart from '~/components/body-fat/BodyFatChart';
import BMIHistoryChart from '~/components/profile/BMIHistoryChart';
import UserDetails from '~/components/profile/UserDetails';
import { useProfile } from '~/context/ProfileContext';

const HomeScreen = () => {
  const { profile, loading, loadProfile } = useProfile(); 
  const [refreshing, setRefreshing] = useState(false); 

  // fun to handle the refresh action
  const onRefresh = async () => {
    setRefreshing(true); 
    await loadProfile(); 
    setRefreshing(false); 
  };

  // show  loading spinner while the profile data is being fetched
  if (loading && !refreshing) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
  }

  // Show a message if no profile data is available
  if (!profile) {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.noDataText}>No profile data available.</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Pass profile data to the components */}
      <BMIHistoryChart bmiHistory={profile.bmiHistory} />
      <BodyFatChart title="Body Fat History" />
      <UserDetails profile={profile} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;