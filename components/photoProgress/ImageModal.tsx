import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import * as ImageManipulator from 'expo-image-manipulator';

interface ImageModalProps {
  isVisible: boolean;
  imageUri: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isVisible, imageUri, onClose }) => {
  const [filteredImageUri, setFilteredImageUri] = useState<string | null>(null); // Track filtered image URI
  const [loading, setLoading] = useState<boolean>(false); // Track loading state

  // Apply the selected filter
  const applyFilter = async (filterType: string) => {
    if (!imageUri) return;

    setLoading(true); // Start loading

    let actions: ImageManipulator.Action[] = []; // Explicitly type actions as Action[]
    switch (filterType) {
      case 'grayscale':
        actions.push({ grayscale: 1 } as unknown as ImageManipulator.Action);
        break;
      case 'sepia':
        actions.push({ sepia: 1 } as unknown as ImageManipulator.Action);
        break;
      case 'brightness':
        actions.push({ brightness: 0.5 } as unknown as ImageManipulator.Action);
        break;
      case 'contrast':
        actions.push({ contrast: 1.5 } as unknown as ImageManipulator.Action);
        break;
      default:
        break;
    }

    try {
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        actions,
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setFilteredImageUri(result.uri); // Set the filtered image URI
    } catch (error) {
      console.error('Error applying filter:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        {/* Display the filtered image */}
        <View style={styles.imageContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" /> // Show loading spinner
          ) : (
            <Image
              source={{ uri: filteredImageUri || imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>

        {/* Filter buttons */}
        <View style={styles.filterButtonsContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => applyFilter('grayscale')}
            disabled={loading} // Disable button while loading
          >
            <Text style={styles.filterButtonText}>Black & White</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => applyFilter('sepia')}
            disabled={loading} // Disable button while loading
          >
            <Text style={styles.filterButtonText}>Sepia</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => applyFilter('brightness')}
            disabled={loading} // Disable button while loading
          >
            <Text style={styles.filterButtonText}>Brightness</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => applyFilter('contrast')}
            disabled={loading} // Disable button while loading
          >
            <Text style={styles.filterButtonText}>Contrast</Text>
          </TouchableOpacity>
        </View>

        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  imageContainer: {
    width: 300,
    height: 300,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  filterButtonText: {
    color: 'white',
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ImageModal;