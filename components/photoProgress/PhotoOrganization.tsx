import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
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
  const [isLoading, setIsLoading] = useState(true);

  // Fetch photos from AsyncStorage
  useEffect(() => {
    const fetchPhotos = async () => {
      const photosData = (await getData('progressPhotos')) || [];
      setPhotos(photosData);
      setIsLoading(false);
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

  // Render each photo item
  const renderPhotoItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity onPress={() => openModal(item.uri)}>
      <Image source={{ uri: item.uri }} style={styles.photo} />
    </TouchableOpacity>
  );

  // Render each week section
  const renderWeekSection = ({ item }: { item: [string, Photo[]] }) => (
    <View style={styles.weekContainer}>
      <View style={styles.weekHeader}>
        <Text style={styles.weekTitle}>Week of {item[0]}</Text>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={() => generateVideoForWeek(item[0])}
          disabled={loadingWeeks[item[0]]}
        >
          {loadingWeeks[item[0]] ? (
            <ActivityIndicator color="#6a11cb" />
          ) : (
            <MaterialIcons name="video-library" size={24} color="#6a11cb" />
          )}
        </TouchableOpacity>
      </View>
      <FlatList
        data={item[1]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(photo) => photo.uri}
        renderItem={renderPhotoItem}
        contentContainerStyle={styles.photoList}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#6a11cb" style={styles.loadingIndicator} />
      ) : Object.keys(groupedPhotos).length > 0 ? (
        <FlatList
          data={Object.entries(groupedPhotos)}
          keyExtractor={(item) => item[0]}
          renderItem={renderWeekSection}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noPhotosText}>No photos available.</Text>
      )}

      {/* Image Modal */}
      <ImageModal
        isVisible={isModalVisible}
        imageUri={selectedImage || ''}
        onClose={closeModal}
        onSave={handleSaveImage}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');
const photoSize = 100; // Fixed size for each photo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  weekContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  generateButton: {
    padding: 5,
  },
  photoList: {
    paddingVertical: 5,
  },
  photo: {
    width: photoSize,
    height: photoSize,
    borderRadius: 8,
    marginRight: 10,
  },
  noPhotosText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PhotoOrganization;