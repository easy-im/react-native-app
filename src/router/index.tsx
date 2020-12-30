import React from 'react';
import { Route } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';
import TabIcon from './TabIcon';

import Recent from '../pages/chat/recent';
import AddressBook from '../pages/address-book';
import Chat from '../pages/chat/chat';
import Login from '../pages/user/login';
import Register from '../pages/user/register';
import Profile from '../pages/user/profile';

export default {
  tabBar: {
    list: [
      {
        name: 'Home',
        component: Recent,
        options: {
          tabBarLabel: '消息',
          tabBarBadge: 3,
        },
      },
      {
        name: 'AddressBook',
        component: AddressBook,
        options: {
          tabBarLabel: '通讯录',
        },
      },
      {
        name: 'User',
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
      activeTintColor: '#1441B8',
      inactiveTintColor: '#666666',
      labelStyle: { marginBottom: 4 },
    },
  },
  pages: {
    list: [
      {
        name: 'Chat',
        component: Chat,
        options: { title: '对话' },
      },
      {
        name: 'Login',
        component: Login,
        options: {
          headerShown: false,
        },
      },
      {
        name: 'Register',
        component: Register,
        options: {
          headerShown: false,
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
