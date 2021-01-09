import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';
import { Toast } from '@ant-design/react-native';
import { GetUserFriendList, AutoLogin } from '@/store/reducer/user';
import { GetUnreadMessage } from '@/store/reducer/message';
import Socket from '@/socket/chat';

const InitApp: React.FC<{}> = ({}) => {
  const dispatch = useDispatch();
  // const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const res: any = await dispatch(AutoLogin());
      if (!res.success) {
        Toast.info(res.errmsg);
        // navigation.reset({
        //   index: 0,
        //   routes: [
        //     {
        //       name: 'Login',
        //     },
        //   ],
        // });
        return;
      }
      Socket.setup();
      dispatch(GetUserFriendList());
      dispatch(GetUnreadMessage());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

export default InitApp;
