import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  MovieDetails: { movieId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} options={{ title: 'Details' }} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
