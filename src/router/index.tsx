import React from 'react';
import { Route } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';
import { Platform } from 'react-native';
import TabIcon from './TabIcon';
import MODULES from './MODULES';
import Colors from '@/utils/color';
import AddressBook from '@/pages/address-book';
import Recent from '@/pages/chat/recent';
import Chat from '@/pages/chat/chat';
import Search from '@/pages/chat/search';
import FriendRequest from '@/pages/chat/friendRequest';
import Login from '@/pages/user/login';
import Register from '@/pages/user/register';
import Profile from '@/pages/user/profile';
import ApplyToFriend from '@/pages/chat/applyToFriend';

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
            height: Platform.OS === 'android' ? 44 : undefined, // ios设置会错乱
            backgroundColor: Colors.white,
          },
        },
      },
      {
        name: MODULES.Search,
        component: Search,
        options: {
          title: '添加好友',
          headerShown: false,
        },
      },
      {
        name: MODULES.ApplyToFriend,
        component: ApplyToFriend,
        options: {
          title: '好友申请',
          headerShown: false,
        },
      },
      {
        name: MODULES.FriendRequest,
        component: FriendRequest,
        options: {
          title: '新的朋友',
          headerStyle: {
            height: Platform.OS === 'android' ? 44 : undefined, // ios设置会错乱
            backgroundColor: Colors.background,
          },
        },
      },
    ],
    screenOptions: {
      headerStyle: {
        height: 44,
        backgroundColor: Colors.white,
      },
      gestureEnabled: true,
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
};
