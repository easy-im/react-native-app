import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as AntProvider } from '@ant-design/react-native';
import router from '@/router';
import UserStorage from '@/storage/user';
import store from '@/store';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getAuthUser();
      SplashScreen.hide();
      if (user) {
        setCurrentUser(user);
      }
      setLoaded(true);
    })();
    return () => {
      UserStorage.close();
    };
  }, []);

  const getAuthUser = async () => {
    // UserStorage.deleteAll();
    await UserStorage.deleteUser(1);
    const res = await UserStorage.getAuthUser();
    if (res && res.length) {
      return res[0];
    }
    return null;
  };

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
  const initialRouteName = currentUser ? 'TabNav' : 'Login';

  if (!loaded) {
    return null;
  }

  return (
    <ReduxProvider store={store}>
      <AntProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={screenOptions} initialRouteName={initialRouteName}>
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
      </AntProvider>
    </ReduxProvider>
  );
}
