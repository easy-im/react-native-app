import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import COLORS from '@/core/color';
import tabbar from '@/router/tabbar';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PAGE_LIST: { pageName: string; component: React.ComponentType<any>; options?: StackNavigationOptions }[] = [];

export const PageContainer = (
  pageName: string,
  component: React.ComponentType<any>,
  options?: StackNavigationOptions,
) => {
  if (!PAGE_LIST.find((item) => item.pageName === pageName)) {
    PAGE_LIST.push({
      pageName,
      component,
      options,
    });
  }
};

export const Router: React.FC<{ initialRouteName: string }> = ({ initialRouteName }) => {
  const TabScreen = () => {
    const { screenOptions, tabBarOptions, list } = tabbar;
    return (
      <Tab.Navigator screenOptions={screenOptions} tabBarOptions={tabBarOptions}>
        {list.map((item, index) => {
          return <Tab.Screen key={index} name={item.name} component={item.component} options={item.options} />;
        })}
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            height: 44,
            backgroundColor: COLORS.fill_base,
          },
          gestureEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}
        initialRouteName={initialRouteName}
      >
        <Stack.Screen
          name="TabNav"
          component={TabScreen}
          options={{
            headerShown: false,
            title: '消息',
          }}
        />
        {PAGE_LIST.map((item) => {
          return (
            <Stack.Screen name={item.pageName} component={item.component} options={item.options} key={item.pageName} />
          );
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
