import React, { useEffect, useState } from 'react';
import { Portal } from 'react-native-ui-view';
import { Router } from '@/router';
import store from '@/store';

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
      const { success } = await userStore.autoLogin();
      setIsLoggedIn(success);
      setLoaded(true);
    })();
  }, [userStore]);

  if (!loaded) {
    return null;
  }

  // 已登录就显示tab，否者显示登录页面
  const initialRouteName = isLoggedIn ? 'TabNav' : 'Login';

  return (
    <Portal>
      <Router initialRouteName={initialRouteName} />
    </Portal>
  );
}
