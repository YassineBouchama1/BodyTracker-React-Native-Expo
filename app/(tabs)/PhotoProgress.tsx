import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PhotoOrganization from '~/components/photoProgress/PhotoOrganization';

const PhotoProgressScreen = () => {


  return (
    <View style={{ flex: 1 , padding:8}}>
    <PhotoOrganization />
  </View>
  );
};


export default PhotoProgressScreen;