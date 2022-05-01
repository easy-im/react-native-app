import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Portal } from 'react-native-ui-view';
import router from '@/router';
import store from '@/store';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { userStore } = store;

  useEffect(() => {
    (async () => {
      const { success } = await userStore.autoLogin();
      console.log(111, success);
      setIsLoggedIn(success);
      setLoaded(true);
    })();
  }, [userStore]);

  // 已登录就显示tab，否者显示登录页面
  const initialRouteName = isLoggedIn ? 'TabNav' : 'Login';

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

  if (!loaded) {
    return null;
  }

  const { pages } = router;
  const { screenOptions, list } = pages;

  return (
    <Portal>
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions} initialRouteName={initialRouteName}>
          <Stack.Screen
            name="TabNav"
            component={TabScreen}
            options={{
              headerShown: false,
              title: '消息',
            }}
          />
          {list.map((item, index) => {
            return <Stack.Screen key={index} name={item.name} component={item.component} options={item.options} />;
          })}
        </Stack.Navigator>
      </NavigationContainer>
    </Portal>
  );
}
