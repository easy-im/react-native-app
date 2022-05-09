import React, { useEffect, useState } from 'react';
import { Portal } from 'react-native-ui-view';
import { Router } from '@/router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInfo } from '@/types/user';
import store from '@/store';
import { CURRENT_USER_KEY, P_HOME, P_LOGIN } from '@/core/constant';

import '@/pages/user/login';
import '@/pages/user/register';
import '@/pages/chat/addFriend';
import '@/pages/chat/applyToFriend';
import '@/pages/chat/chat';
import '@/pages/chat/friendRequest';
import '@/pages/chat/search';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { userStore } = store;

  useEffect(() => {
    (async () => {
      setLoaded(false);

      const userStr = await AsyncStorage.getItem(CURRENT_USER_KEY);
      let user: UserInfo | null = null;
      try {
        user = userStr ? JSON.parse(userStr) : null;
      } catch (error) {}
      // 只要本地有数据，就进入应用，后续验证登陆合法性
      setIsLoggedIn(!!user?.id);

      await userStore.autoLogin();
      setLoaded(true);
    })();
  }, [userStore]);

  if (!loaded) {
    return null;
  }

  // 已登录就显示tab，否者显示登录页面
  const initialRouteName = isLoggedIn ? P_HOME : P_LOGIN;

  return (
    <Portal>
      <Router initialRouteName={initialRouteName} />
    </Portal>
  );
}
