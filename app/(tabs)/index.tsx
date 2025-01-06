import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import BodyFatChart from '~/components/body-fat/BodyFatChart';
import BMIHistoryChart from '~/components/profile/BMIHistoryChart';
import UserDetails from '~/components/profile/UserDetails';

const HomeScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BMIHistoryChart />
      <BodyFatChart title="Body Fat History" />
      <UserDetails />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  
    backgroundColor: '#f5f5f5',
  },
});

export default HomeScreen;