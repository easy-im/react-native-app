import React from 'react';
import { Route } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';
import TabIcon from './TabIcon';
import MODULES from './MODULES';
import Recent from '../pages/chat/recent';
import AddressBook from '../pages/address-book';
import Chat from '../pages/chat/chat';
import Login from '../pages/user/login';
import Register from '../pages/user/register';
import Profile from '../pages/user/profile';
import Colors from '@/utils/color';

export default {
  tabBar: {
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
      activeTintColor: Colors.blue,
      inactiveTintColor: Colors.lightGray,
      labelStyle: { marginBottom: 4 },
    },
  },
  pages: {
    list: [
      {
        name: MODULES.Login,
        component: Login,
        options: {
          headerShown: false,
        },
      },
      {
        name: MODULES.Register,
        component: Register,
        options: {
          headerShown: false,
        },
      },
      {
        name: MODULES.Chat,
        component: Chat,
        options: {
          title: '对话',
          headerStyle: {
            backgroundColor: Colors.white,
          },
        },
      },
    ],
    screenOptions: {
      headerStyle: {
        height: 48,
      },
      gestureEnabled: true,
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
};
