import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Link } from 'expo-router';
import { useModal } from '~/context/ModalContext';

const FloatingActionButtonGroup = () => {

  const [isExpanded, setIsExpanded] = useState(false);
  const {dispatch} = useModal()



  const button1Y = useSharedValue(0);
  const button2Y = useSharedValue(0);
  const button3Y = useSharedValue(0);
  const opacity = useSharedValue(0); 
  const scale = useSharedValue(0); 



  const toggleExpansion = () => {
    if (isExpanded) {
      // Collapse buttons
      button1Y.value = withSpring(0, { damping: 10, stiffness: 100 });
      button2Y.value = withSpring(0, { damping: 10, stiffness: 100 });
      button3Y.value = withSpring(0, { damping: 10, stiffness: 100 });
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0, { duration: 200 });
    } else {
      // Expand buttons
      button1Y.value = withSpring(-40, { damping: 10, stiffness: 100 });
      button2Y.value = withSpring(-60, { damping: 10, stiffness: 100 });
      button3Y.value = withSpring(-80, { damping: 10, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withTiming(1, { duration: 200 });
    }
    setIsExpanded(!isExpanded);
  };




  const button1Style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: button1Y.value }, { scale: scale.value }],
    };
  });

  const button2Style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: button2Y.value }, { scale: scale.value }],
    };
  });

  const button3Style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: button3Y.value }, { scale: scale.value }],
    };
  });

  return (
    <View style={styles.floatingButtonContainer}>
  <Animated.View style={[styles.floatingButton, button3Style]}>
  <Link href="/camera" asChild>
    <TouchableOpacity>
      <Ionicons name="camera" size={24} color="#fff" />
    </TouchableOpacity>
  </Link>
</Animated.View>

      <Animated.View style={[styles.floatingButton, button2Style]}>
      <Link href="/profile" asChild>
        <TouchableOpacity >
          <Ionicons name="settings" size={24} color="#fff" />
        </TouchableOpacity>
        </Link>
      </Animated.View>

      <Animated.View style={[styles.floatingButton, button1Style]}>
        <TouchableOpacity onPress={() => console.log('Button 1 Pressed')}>
          <Ionicons name="document" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.floatingButton} onPress={toggleExpansion}>
        <Ionicons name={isExpanded ? 'close' : 'add'} size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    zIndex: 1,
  

   
  },
  floatingButton: {
    backgroundColor: '#6a11cb',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default FloatingActionButtonGroup;