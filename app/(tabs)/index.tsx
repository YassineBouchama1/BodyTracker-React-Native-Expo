import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import BMIHistoryChart from '~/components/profile/BMIHistoryChart';
import UserDetails from '~/components/profile/UserDetails';

const HomeScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <UserDetails />
      <BMIHistoryChart />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
});

export default HomeScreen;