import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getData } from '../../utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import ImageModal from './ImageModal';
import useVideoGeneration from '~/hooks/useVideoGeneration';

interface Photo {
  uri: string;
  date: string;
}

const PhotoOrganization = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { loadingWeeks, generateVideoForWeek } = useVideoGeneration();

  // Fetch photos from AsyncStorage
  useEffect(() => {
    const fetchPhotos = async () => {
      const photosData = (await getData('progressPhotos')) || [];
      setPhotos(photosData);
    };
    fetchPhotos();
  }, []);

  // Group photos by week
  const groupPhotosByWeek = (photos: Photo[]) => {
    const grouped: { [key: string]: Photo[] } = {};
    photos.forEach((photo) => {
      const date = new Date(photo.date);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay())).toISOString().split('T')[0];
      if (!grouped[weekStart]) {
        grouped[weekStart] = [];
      }
      grouped[weekStart].push(photo);
    });
    return grouped;
  };

  const groupedPhotos = groupPhotosByWeek(photos);


  // Open modal with selected image
  const openModal = (imageUri: string) => {
    setSelectedImage(imageUri);
    setIsModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
  };

  // Update the photo in the photos state
  const handleSaveImage = (newImageUri: string) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.uri === selectedImage ? { ...photo, uri: newImageUri } : photo
      )
    );
  };

  return (
    <View style={styles.container}>
      {Object.keys(groupedPhotos).length > 0 ? (
        <FlatList
          data={Object.entries(groupedPhotos)}
          keyExtractor={(item) => item[0]}
          renderItem={({ item }) => (
            <View style={styles.weekContainer}>
              <View style={styles.weekHeader}>
                <Text style={styles.weekTitle}>Week of {item[0]}</Text>
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={() => generateVideoForWeek(item[0])}
                  disabled={loadingWeeks[item[0]]}
                >
                  {loadingWeeks[item[0]] ? (
                    <ActivityIndicator color="#007AFF" />
                  ) : (
                    <MaterialIcons name="video-library" size={24} color="#007AFF" />
                  )}
                </TouchableOpacity>
              </View>
              <FlatList
                data={item[1]}
                horizontal
                keyExtractor={(photo) => photo.uri}
                renderItem={({ item: photo }) => (
                  <TouchableOpacity onPress={() => openModal(photo.uri)}>
                    <Image source={{ uri: photo.uri }} style={styles.photo} />
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        />
      ) : (
        <Text style={styles.noPhotosText}>No photos available.</Text>
      )}

      {/* Image Modal */}
      <ImageModal
        isVisible={isModalVisible}
        imageUri={selectedImage || ''}
        onClose={closeModal}
        onSave={handleSaveImage} // Pass the callback to handle the updated image
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  weekContainer: {
    marginBottom: 20,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  generateButton: {
    padding: 5,
  },
  photo: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  noPhotosText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PhotoOrganization;