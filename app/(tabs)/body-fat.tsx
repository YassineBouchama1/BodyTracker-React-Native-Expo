import { ScrollView, Text, View } from 'react-native';
import BodyFatCalculator from '~/components/body-fat/BodyFatCalculator';
import { Stack } from 'expo-router';
import { useProfile } from '~/context/ProfileContext';

export default function BodyFatScreen() {
  const { profile ,loading } = useProfile();
  
  if (loading) return <View><Text>Loading...</Text></View>;
  
  if(!profile)return <View><Text>no profile</Text></View>;
  return (
    <>
    <Stack.Screen options={{ title: 'Body fit calculator' }} />
    <ScrollView>

    <BodyFatCalculator
      height={profile.height}
      gender={profile.gender}
      />
      </ScrollView>
      </>
  );
}