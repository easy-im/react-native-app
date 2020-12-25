import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {TransitionPresets} from '@react-navigation/stack';
import Recent from './pages/chat/recent';
import Profile from './pages/user/profile';
import Login from './pages/user/login';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const TabScreen = () => {
    return (
      <Tab.Navigator screenOptions={{}}>
        <Tab.Screen name="Recent" component={Recent} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <Stack.Screen name="TabNav" options={{title: 'EZ-CHAT'}} component={TabScreen} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
