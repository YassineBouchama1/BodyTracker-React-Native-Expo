import { ProfileProvider } from '~/context/ProfileContext';
import '../global.css';
import { Stack } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ModalProvider } from '~/context/ModalContext';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <>
          <GestureHandlerRootView style={{ flex: 1 }}>

<ModalProvider>
      <ProfileProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false, // Hide the header for the tabs layout
            }}
            />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              headerRight: () => (
                <TouchableOpacity onPress={() => console.log('Header button pressed')}>
                  <Text style={{ color: 'blue', marginRight: 15 }}>Edit</Text>
                </TouchableOpacity>
              ),
            }}
            />
        </Stack>
      </ProfileProvider>
            </ModalProvider>
            </GestureHandlerRootView>
    </>
  );
}