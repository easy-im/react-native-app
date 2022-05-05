import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import COLORS from '@/core/color';
import { formatTime } from '@/utils';
import { Friend } from '@/types/user';
import { MODULES } from '@/core/constant';
import { rpx } from '@/utils/screen';
import store from '@/store';
import config from '@/config';

const Recent: React.FC<{}> = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { userStore, messageStore } = store;
  const navigation = useNavigation();

  const { friendMap } = userStore;
  const { recent, messageMap, totalMessage } = messageStore;

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    navigation.setOptions({
      tabBarBadge: totalMessage <= 0 ? undefined : totalMessage,
    });
  }, [navigation, totalMessage]);

  const init = async () => {
    setLoading(true);
    await refresh();
    setLoading(false);
  };

  const refresh = async () => {
    await userStore.getUserFriendRequest();
    await userStore.getUserFriendList();
    await messageStore.getUnreadMessage();
  };

  const chat2user = (item: Friend) => {
    navigation.navigate(MODULES.Chat, { id: item.fid, title: item.remark || item.nickname });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <ScrollView
        style={styles.container}
        alwaysBounceVertical
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Header title={config.appName} loading={loading} />
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.color_text_base_inverse,
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
    backgroundColor: COLORS.red,
    paddingTop: rpx(3),
    paddingBottom: rpx(2),
    paddingLeft: rpx(6),
    paddingRight: rpx(6),
    borderRadius: rpx(8),
  },
  badgeText: {
    fontSize: rpx(11),
    lineHeight: rpx(11),
    color: COLORS.color_text_base_inverse,
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
    borderBottomColor: COLORS.borderLightColor,
    borderBottomWidth: 0.5,
    paddingTop: rpx(10),
    paddingBottom: rpx(10),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  contentText: {
    lineHeight: rpx(22),
  },
  userName: {
    fontSize: rpx(16),
    color: COLORS.color_text_paragraph,
    fontWeight: '600',
  },
  message: {
    fontSize: rpx(13),
    color: COLORS.color_text_disabled,
  },
  time: {
    color: COLORS.color_text_disabled,
    marginLeft: rpx(13),
  },
});

export default observer(Recent);
