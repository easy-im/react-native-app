import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import COLORS from '@/core/color';
import store from '@/store';
import { useNavigation } from '@react-navigation/native';
import { P_LOGIN, ScreenProp } from '@/core/constant';
import { observer } from 'mobx-react-lite';
import { Spin } from 'react-native-ui-view';
import { rpx } from '@/utils/screen';

type Props = {};
const Connecting: React.FC<Props> = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation<ScreenProp>();

  const { userStore } = store;
  const { isLoggedIn } = userStore;

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = async () => {
    // 已经登陆成功的就不需要登陆
    if (isLoggedIn) {
      return;
    }

    const { result, success } = await userStore.autoLogin();
    // 请求不成功，重新拉取
    if (!success) {
      setVisible(true);
      setTimeout(() => {
        init();
      }, 1000);
      return;
    }

    // 请求成功，但是登陆失败，跳回登陆页面
    if (!result) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: P_LOGIN,
          },
        ],
      });
      return;
    }

    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Spin size={20} color={COLORS.brand_wait} />
      <Text style={styles.text}>服务连接中……</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.notice_bar_fill,
    paddingHorizontal: rpx(8),
    paddingVertical: rpx(12),
  },
  text: {
    fontSize: rpx(14),
    marginLeft: rpx(12),
    color: COLORS.color_text_caption,
  },
});

export default observer(Connecting);
