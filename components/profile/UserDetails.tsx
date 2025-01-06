import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useProfile } from '~/context/ProfileContext';

const UserDetails = () => {
  const { profile } = useProfile();

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No profile data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Details</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>First Name:</Text>
          <Text style={styles.value}>{profile.firstName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Last Name:</Text>
          <Text style={styles.value}>{profile.lastName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{profile.age}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Nationality:</Text>
          <Text style={styles.value}>{profile.nationality}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Weight:</Text>
          <Text style={styles.value}>{profile.weight} kg</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Height:</Text>
          <Text style={styles.value}>{profile.height} cm</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{profile.gender}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{profile.address}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  },
});

export default UserDetails;