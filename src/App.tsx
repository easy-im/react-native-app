import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import router from './router';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const TabScreen = () => {
    const { tabBar } = router;
    const { screenOptions, tabBarOptions, list } = tabBar;
    return (
      <Tab.Navigator screenOptions={screenOptions} tabBarOptions={tabBarOptions}>
        {list.map((item, index) => {
          return <Tab.Screen key={index} name={item.name} component={item.component} options={item.options} />;
        })}
      </Tab.Navigator>
    );
  };

  const { pages } = router;
  const { screenOptions, list } = pages;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="TabNav"
          component={TabScreen}
          options={{
            headerShown: false,
          }}
        />
        {list.map((item, index) => {
          return <Stack.Screen key={index} name={item.name} component={item.component} options={item.options} />;
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
