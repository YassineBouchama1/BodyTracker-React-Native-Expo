import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import { GLView } from 'expo-gl';

interface ImageModalProps {
  isVisible: boolean;
  imageUri: string;
  onClose: () => void;
  onSave: (newImageUri: string) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isVisible, imageUri, onClose, onSave }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [temporaryImageUri, setTemporaryImageUri] = useState<string | null>(null);

  // Reset states when the modal is closed
  useEffect(() => {
    if (!isVisible) {
      setActiveFilter(null);
      setTemporaryImageUri(null);
    }
  }, [isVisible]);

  const applyFilter = async (filterType: string) => {
    if (!imageUri) return;

    setLoading(true);
    setActiveFilter(filterType);

    try {
      if (filterType === 'rotate' || filterType === 'flip') {
        // Handle rotate and flip using expo-image-manipulator
        let actions: ImageManipulator.Action[] = [];
        if (filterType === 'rotate') {
          actions.push({ rotate: 90 });
        } else if (filterType === 'flip') {
          actions.push({ flip: ImageManipulator.FlipType.Vertical });
        }

        const result = await ImageManipulator.manipulateAsync(
          temporaryImageUri || imageUri, // Use the current temporary image or the original
          actions,
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        setTemporaryImageUri(result.uri); // Update the temporary image URI
      } else if (filterType === 'grayscale' || filterType === 'sepia') {
        // Handle grayscale and sepia filters using expo-image-manipulator
        const result = await ImageManipulator.manipulateAsync(
          temporaryImageUri || imageUri,
          [
            {
              [filterType]: {
                extent: { originX: 0, originY: 0, width: 1, height: 1 }, // Apply filter to the entire image
              },
            },
          ],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        setTemporaryImageUri(result.uri); // Update the temporary image URI
      }
    } catch (error) {
      console.error('Error applying filter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (temporaryImageUri) {
      onSave(temporaryImageUri); // Save the temporary image URI
    }
    onClose(); // Close the modal after saving
  };

  const handleClose = () => {
    onClose(); // Close the modal without saving
  };

  const renderFilteredImage = () => {
    const uri = temporaryImageUri || imageUri; // Use the temporary image URI or the original

    if (activeFilter === 'custom') {
      return (
        <GLView
          style={styles.image}
          onContextCreate={async (gl) => {
            // Create a WebGL texture from the image
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            // Load the image into the texture
            const image = new Image();
            image.src = uri;
            image.onload = () => {
              gl.bindTexture(gl.TEXTURE_2D, texture);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            };

            // Define a simple shader program
            const vertexShaderSource = `
              attribute vec2 position;
              varying vec2 uv;
              void main() {
                uv = position * 0.5 + 0.5;
                gl_Position = vec4(position, 0.0, 1.0);
              }
            `;

            const fragmentShaderSource = `
              precision highp float;
              uniform sampler2D texture;
              varying vec2 uv;
              void main() {
                vec4 color = texture2D(texture, uv);
                // Apply a custom filter (e.g., invert colors)
                gl_FragColor = vec4(1.0 - color.rgb, color.a);
              }
            `;

            // Compile the shaders
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, vertexShaderSource);
            gl.compileShader(vertexShader);

            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, fragmentShaderSource);
            gl.compileShader(fragmentShader);

            // Link the shaders into a program
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            gl.useProgram(program);

            // Define the geometry
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
              gl.STATIC_DRAW
            );

            // Set up the position attribute
            const positionLocation = gl.getAttribLocation(program, 'position');
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            // Draw the texture
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.endFrameEXP();
          }}
        />
      );
    } else {
      return <Image source={{ uri }} style={styles.image} resizeMode="contain" />;
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={handleClose}>
      <View style={styles.modalContainer}>
        <View style={styles.imageContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            renderFilteredImage()
          )}
        </View>

        <View style={styles.filterButtonsContainer}>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'grayscale' && styles.activeFilterButton]}
            onPress={() => applyFilter('grayscale')}
            disabled={loading}
          >
            <MaterialIcons name="invert-colors" size={24} color="#fff" />
            <Text style={styles.filterButtonText}>Grayscale</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'sepia' && styles.activeFilterButton]}
            onPress={() => applyFilter('sepia')}
            disabled={loading}
          >
            <MaterialIcons name="photo-filter" size={24} color="#fff" />
            <Text style={styles.filterButtonText}>Sepia</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'rotate' && styles.activeFilterButton]}
            onPress={() => applyFilter('rotate')}
            disabled={loading}
          >
            <MaterialIcons name="rotate-right" size={24} color="#fff" />
            <Text style={styles.filterButtonText}>Rotate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'flip' && styles.activeFilterButton]}
            onPress={() => applyFilter('flip')}
            disabled={loading}
          >
            <MaterialIcons name="flip" size={24} color="#fff" />
            <Text style={styles.filterButtonText}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'custom' && styles.activeFilterButton]}
            onPress={() => setActiveFilter('custom')}
            disabled={loading}
          >
            <MaterialIcons name="color-lens" size={24} color="#fff" />
            <Text style={styles.filterButtonText}>Custom</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
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
    borderRadius: 10,
    overflow: 'hidden',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  activeFilterButton: {
    backgroundColor: '#005bb5',
  },
  filterButtonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ImageModal;