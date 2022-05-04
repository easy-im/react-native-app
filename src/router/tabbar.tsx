import React from 'react';
import { Image } from 'react-native';
import { Route } from '@react-navigation/native';

import COLORS from '@/core/color';
import { MODULES } from '@/core/constant';

import AddressBook from '@/pages/tabbar/addressBook';
import Recent from '@/pages/tabbar/recent';
import Profile from '@/pages/tabbar/profile';

const TabIcon: React.FC<any> = ({ route, focused, size }) => {
  const list: Record<string, { iconPath: any; selectedIconPath: any }> = {
    [MODULES.Recent]: {
      iconPath: require('../assets/images/tab/chat.png'),
      selectedIconPath: require('../assets/images/tab/chat-active.png'),
    },
    [MODULES.AddressBook]: {
      iconPath: require('../assets/images/tab/address-book.png'),
      selectedIconPath: require('../assets/images/tab/address-book-active.png'),
    },
    [MODULES.Profile]: {
      iconPath: require('../assets/images/tab/user.png'),
      selectedIconPath: require('../assets/images/tab/user-active.png'),
    },
  };
  const { name } = route;
  const select = list[name];
  if (!select) {
    return null;
  }
  return (
    <Image
      source={focused ? select.selectedIconPath : select.iconPath}
      style={{ width: size * 0.9, height: size * 0.9 }}
    />
  );
};

const tabBar = {
  list: [
    {
      name: MODULES.Recent,
      component: Recent,
      options: {
        tabBarLabel: '消息',
      },
    },
    {
      name: MODULES.AddressBook,
      component: AddressBook,
      options: {
        tabBarLabel: '通讯录',
      },
    },
    {
      name: MODULES.Profile,
      component: Profile,
      options: {
        tabBarLabel: '我',
      },
    },
  ],
  screenOptions: ({ route }: { route: Route<string, object | undefined> }) => ({
    tabBarIcon: (props: { focused: boolean; color: string; size: number }) => {
      const { focused, color, size } = props;
      return <TabIcon route={route} focused={focused} color={color} size={size} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: COLORS.lightBlue,
    inactiveTintColor: COLORS.lightGray,
    labelStyle: { marginBottom: 4 },
  },
};

export default tabBar;
