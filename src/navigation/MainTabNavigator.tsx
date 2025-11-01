import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import { Home, Bookmark } from 'lucide-react-native';

export type MainTabsParamList = {
  Home: undefined;
  Watchlist: undefined;
};

// @ts-ignore
const Tab = createBottomTabNavigator<MainTabsParamList>();

const MainTabs = () => {
  // @ts-ignore

  return (
    <Tab.Navigator
      // @ts-ignore
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0F7EA7',
        tabBarInactiveTintColor: '#9CA3AF',
        // @ts-ignore
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'Home') {
            return <Home size={size} color={color} strokeWidth={focused ? 2.4 : 1.6} />;
          }
          return <Bookmark size={size} color={color} strokeWidth={focused ? 2.4 : 1.6} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
