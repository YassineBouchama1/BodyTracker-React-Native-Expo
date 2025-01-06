import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getData } from '../../utils/storage';
import { MaterialIcons } from '@expo/vector-icons'; // Import icons
import ImageModal from './ImageModal'; // Import the ImageModal component

interface Photo {
  uri: string;
  date: string;
}

const PhotoOrganization = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingWeeks, setLoadingWeeks] = useState<{ [key: string]: boolean }>({}); // Track loading state for each week
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Track selected image
  const [isModalVisible, setIsModalVisible] = useState(false); // Track modal visibility

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

  // Simulate video generation (replace with actual logic)
  const generateVideoForWeek = async (weekStart: string) => {
    setLoadingWeeks((prev) => ({ ...prev, [weekStart]: true })); // Set loading state for the week

    // Simulate a delay for video generation (replace with actual logic)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setLoadingWeeks((prev) => ({ ...prev, [weekStart]: false })); // Clear loading state for the week
    alert(`Video for week ${weekStart} generated successfully!`);
  };

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
                  disabled={loadingWeeks[item[0]]} // Disable button while loading
                >
                  {loadingWeeks[item[0]] ? (
                    <ActivityIndicator color="#007AFF" /> // Show loading spinner
                  ) : (
                    <MaterialIcons name="video-library" size={24} color="#007AFF" /> // Show video icon
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