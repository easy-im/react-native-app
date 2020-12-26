import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {TransitionPresets} from '@react-navigation/stack';
import TabIcon from './components/TabIcon';
import Recent from './pages/chat/recent';
import Profile from './pages/user/profile';
import Login from './pages/user/login';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const TabScreen = () => {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: (props) => {
            const {focused, color, size} = props;
            return <TabIcon route={route} focused={focused} color={color} size={size} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#1441B8',
          inactiveTintColor: '#666666',
          labelStyle: {marginBottom: 4},
        }}>
        <Tab.Screen
          name="Home"
          component={Recent}
          options={{
            tabBarLabel: '主页',
            tabBarBadge: 3,
          }}
        />
        <Tab.Screen
          name="User"
          component={Profile}
          options={{
            tabBarLabel: '我',
          }}
        />
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
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
