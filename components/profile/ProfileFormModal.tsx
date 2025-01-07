import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserProfile } from '~/types/profile';

interface ProfileFormModalProps {
  visible: boolean;
  onSave: (profile: UserProfile) => void;
  onUpdate: (profile: UserProfile) => void;
  onClose: () => void;
  profile: UserProfile | null;
}

const ProfileFormModal: React.FC<ProfileFormModalProps> = ({
  visible,
  onSave,
  onUpdate,
  onClose,
  profile,
}) => {
  const [firstName, setFirstName] = useState(profile?.firstName || '');
  const [lastName, setLastName] = useState(profile?.lastName || '');
  const [age, setAge] = useState(profile?.age?.toString() || '');
  const [nationality, setNationality] = useState(profile?.nationality || '');
  const [weight, setWeight] = useState(profile?.weight?.toString() || '');
  const [height, setHeight] = useState(profile?.height?.toString() || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [gender, setGender] = useState<'male' | 'female'>(profile?.gender || 'male');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setAge(profile.age?.toString() || '');
      setNationality(profile.nationality);
      setWeight(profile.weight?.toString() || '');
      setHeight(profile.height?.toString() || '');
      setAddress(profile.address);
      setGender(profile.gender);
    }
  }, [profile]);

  const handleSaveOrUpdate = () => {
    if (!firstName || !lastName || !age || !nationality || !weight || !height || !address) {
      alert('Please fill out all fields.');
      return;
    }

    const updatedProfile: UserProfile = {
      id: profile?.id || Date.now().toString(),
      firstName,
      lastName,
      age: parseInt(age, 10),
      nationality,
      weight: parseFloat(weight),
      height: parseFloat(height),
      address,
      gender,
      bmiHistory: profile?.bmiHistory || [],
      createdAt: profile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (profile) {
      onUpdate(updatedProfile);
    } else {
      onSave(updatedProfile);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
    
     
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {profile ? 'Update Profile' : 'Complete Profile'}
            </Text>

            {profile && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            )}
          </View>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="calendar" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="flag" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nationality"
                value={nationality}
                onChangeText={setNationality}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="barbell" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="resize" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="home" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="transgender" size={20} color="#666" style={styles.icon} />
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>
            </View>
            <TouchableOpacity onPress={handleSaveOrUpdate} style={styles.button}>
              <LinearGradient
                colors={['#6a11cb', '#2575fc']}
                style={styles.gradient}
              >
                <Text style={styles.buttonText}>
                  {profile ? 'Update Profile' : 'Save Profile'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundColor: 'red',
    zIndex: 1,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
   
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
    backgroundColor: 'yellow',
    width: '90%',

   
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',

      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  picker: {
    flex: 1,
    height: 50,
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileFormModal;