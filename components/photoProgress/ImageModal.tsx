import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import * as ImageManipulator from 'expo-image-manipulator';

interface ImageModalProps {
  isVisible: boolean;
  imageUri: string;
  onClose: () => void;
  onSave: (newImageUri: string) => void; 
}

const ImageModal: React.FC<ImageModalProps> = ({ isVisible, imageUri, onClose, onSave }) => {
  const [filteredImageUri, setFilteredImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const applyFilter = async (filterType: string) => {
    if (!imageUri) return;

    setLoading(true);

    let actions: ImageManipulator.Action[] = [];
    switch (filterType) {
      // case 'grayscale':
      //   actions.push({ grayscale: 1 });
      //   break;
      // case 'blur':
      //   actions.push({ blur: 1 });
      //   break;
      case 'rotate':
        actions.push({ rotate: 90 });
        break;
      case 'flip':
        actions.push({ flip: ImageManipulator.FlipType.Vertical });
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
      setFilteredImageUri(result.uri); 
      onSave(result.uri); 
    } catch (error) {
      console.error('Error applying filter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose(); 
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={handleClose}>
      <View style={styles.modalContainer}>
        <View style={styles.imageContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <Image
              source={{ uri: filteredImageUri || imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.filterButtonsContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => applyFilter('grayscale')}
            disabled={loading}
          >
            <Text style={styles.filterButtonText}>Grayscale</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => applyFilter('blur')}
            disabled={loading}
          >
            <Text style={styles.filterButtonText}>Blur</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => applyFilter('rotate')}
            disabled={loading}
          >
            <Text style={styles.filterButtonText}>Rotate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => applyFilter('flip')}
            disabled={loading}
          >
            <Text style={styles.filterButtonText}>Flip</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
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