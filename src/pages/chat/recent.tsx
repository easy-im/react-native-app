import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import color from '@/utils/color';
import { RecoverMessageOnInit, GetUnreadMessage, MessageState } from '@/store/reducer/message';
import { AutoLogin, GetUserFriendList, RecoverUserInfoOnInit, UserState } from '@/store/reducer/user';
import { useDispatch, useSelector } from 'react-redux';
import { formatTime } from '@/utils';
import { Friend } from '@/types/interface/user';
import MODULES from '@/router/MODULES';
import { rpx } from '@/utils/screen';
import Socket from '@/socket/chat';
import { Toast } from '@ant-design/react-native';

const Recent: React.FC<{}> = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const recent = useSelector((state: { message: MessageState }) => state.message.recent);
  const messageMap = useSelector((state: { message: MessageState }) => state.message.messageMap);
  const totalMessage = useSelector((state: { message: MessageState }) => state.message.totalMessage);
  const friendMap = useSelector((state: { user: UserState }) => state.user.friendMap);

  // console.log('recent', recent);
  // console.log('messageMap', messageMap);
  // console.log('friendMap', friendMap);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res: any = await dispatch(AutoLogin());
      if (!res.success) {
        setLoading(false);
        Toast.info(res.errmsg);
        navigation.reset({
          index: 0,
          routes: [
            {
              name: MODULES.Login,
            },
          ],
        });
        return;
      }
      await Socket.setup();
      await dispatch(RecoverUserInfoOnInit());
      await dispatch(RecoverMessageOnInit());
      await dispatch(GetUserFriendList());
      await dispatch(GetUnreadMessage());
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    navigation.setOptions({
      tabBarBadge: totalMessage <= 0 ? undefined : totalMessage,
    });
  }, [navigation, totalMessage]);

  const chat2user = (item: Friend) => {
    navigation.navigate(MODULES.Chat, { id: item.fid, title: item.remark || item.nickname });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <Header title="KitIM" loading={loading} />
      <View style={styles.main}>
        <SearchBar placeholder="请输入关键字" disabled />
        <View style={styles.list}>
          {recent.map((item) => {
            const { fid, last_message, unreadNumber } = item;
            const user = friendMap[item.fid];
            const message = messageMap[last_message];

            if (!user || !message) {
              return null;
            }

            return (
              <TouchableWithoutFeedback onPress={() => chat2user(user)} key={fid}>
                <View style={styles.listItem}>
                  <View style={styles.avatar}>
                    <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                    {unreadNumber > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{unreadNumber > 99 ? '99+' : unreadNumber}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.wrap}>
                    <View style={styles.content}>
                      <View>
                        <Text style={[styles.contentText, styles.userName]}>{user.remark || user.nickname}</Text>
                      </View>
                      <View>
                        <Text style={[styles.contentText, styles.message]} numberOfLines={1}>
                          {message.content}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.time}>{formatTime(message.create_time)}</Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  main: {
    padding: rpx(15),
  },
  list: {
    marginTop: rpx(5),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    position: 'relative',
    width: rpx(42),
    height: rpx(42),
    marginRight: rpx(12),
  },
  badge: {
    position: 'absolute',
    top: rpx(-9),
    right: rpx(-9),
    backgroundColor: color.red,
    paddingTop: rpx(3),
    paddingBottom: rpx(2),
    paddingLeft: rpx(6),
    paddingRight: rpx(6),
    borderRadius: rpx(8),
  },
  badgeText: {
    fontSize: rpx(11),
    lineHeight: rpx(11),
    color: color.white,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: rpx(4),
  },
  wrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomColor: color.borderLightColor,
    borderBottomWidth: 0.5,
    paddingTop: rpx(10),
    paddingBottom: rpx(10),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  contentText: {
    lineHeight: 22,
  },
  userName: {
    fontSize: rpx(16),
    color: color.text,
    fontWeight: '600',
  },
  message: {
    fontSize: rpx(13),
    color: color.gray,
  },
  time: {
    color: color.gray,
    marginLeft: rpx(13),
  },
});

export default Recent;
