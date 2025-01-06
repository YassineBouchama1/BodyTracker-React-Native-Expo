import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import CameraCapture from '~/components/photoProgress/CameraCapture';
import PhotoOrganization from '~/components/photoProgress/PhotoOrganization';

const PhotoProgressScreen = () => {
  const [showCamera, setShowCamera] = useState(false);

  return (
    <View style={styles.container}>
      {showCamera ? (
        <CameraCapture onClose={() => setShowCamera(false)} />
      ) : (
        <>
          <TouchableOpacity style={styles.captureButton} onPress={() => setShowCamera(true)}>
            <Text style={styles.captureButtonText}>Take Progress Photo</Text>
          </TouchableOpacity>
          <PhotoOrganization />
      
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  captureButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PhotoProgressScreen;