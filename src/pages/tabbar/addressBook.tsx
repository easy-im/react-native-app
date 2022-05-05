import React, { useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import Header from '@/components/Header';
import COLORS from '@/core/color';
import store from '@/store';
import { Friend } from '@/types/user';
import { MODULES } from '@/core/constant';
import { rpx } from '@/utils/screen';

const AddressBook: React.FC<{}> = () => {
  const navigation = useNavigation();
  const { userStore } = store;
  const { friendMap, friendList, userFriendRequestCount } = userStore;

  const entryList = [
    {
      image: require('@/assets/images/icon/apply.png'),
      title: '好友申请',
      renderRight: () => (
        <>
          {userFriendRequestCount > 0 && (
            <View style={styles.count}>
              <Text style={styles.countText}>{userFriendRequestCount}</Text>
            </View>
          )}
        </>
      ),
      onPress: () => navigation.navigate(MODULES.FriendRequest),
    },
    {
      image: require('@/assets/images/icon/group.png'),
      title: '我的群组',
    },
  ];

  useEffect(() => {
    navigation.setOptions({
      tabBarBadge: userFriendRequestCount <= 0 ? undefined : userFriendRequestCount,
    });
  }, [navigation, userFriendRequestCount]);

  const chat2user = (friend: Friend) => {
    navigation.navigate(MODULES.Chat, { id: friend.fid, title: friend.remark || friend.nickname });
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container, Platform.OS === 'ios' && { paddingBottom: -34 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.main}>
        <Header title="通讯录" />
        <View>
          <View style={[styles.card, styles.groups]}>
            {entryList.map((item, index) => {
              return (
                <TouchableOpacity
                  style={[styles.groupItem, index === 0 && styles.nonTopBorder]}
                  onPress={item.onPress}
                  key={index}
                >
                  <View style={styles.wrap}>
                    <View style={styles.image}>
                      <Image source={item.image} style={styles.icon} />
                    </View>
                    <View>
                      <Text style={styles.groupText}>{item.title}</Text>
                    </View>
                  </View>
                  {item.renderRight && item.renderRight()}
                </TouchableOpacity>
              );
            })}
          </View>
          <View>
            {friendList.map((item) => {
              return (
                <View key={item.key}>
                  <View style={styles.key}>
                    <Text>{item.key}</Text>
                  </View>
                  <View style={[styles.card]}>
                    {item.list.map((fid, index) => {
                      const friend = friendMap[fid];
                      return (
                        <TouchableWithoutFeedback key={index} onPress={() => chat2user(friend)}>
                          <View style={styles.listItem}>
                            <View style={styles.avatar}>
                              <Image source={{ uri: friend?.avatar }} style={styles.avatarImage} />
                            </View>
                            <View style={[styles.userName, index === 0 && styles.firstUserName]}>
                              <Text style={styles.userNameText}>{friend?.remark || friend?.nickname}</Text>
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.color_text_base_inverse,
  },
  main: {
    flex: 1,
    backgroundColor: COLORS.fill_body,
  },
  card: {
    backgroundColor: COLORS.color_text_base_inverse,
    borderTopColor: COLORS.borderLightColor,
    borderTopWidth: 1,
    borderBottomColor: COLORS.borderLightColor,
    borderBottomWidth: 1,
  },
  groups: {
    borderTopWidth: 0,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rpx(12),
    paddingLeft: rpx(15),
    paddingRight: rpx(15),
    borderTopColor: COLORS.borderLightColor,
    borderTopWidth: 1,
  },
  wrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nonTopBorder: {
    borderTopWidth: 0,
  },
  image: {
    width: rpx(24),
    height: rpx(24),
    marginRight: rpx(15),
    backgroundColor: '#ecbe45',
    padding: rpx(5),
  },
  groupImage: {
    backgroundColor: '#27e2e2',
  },
  icon: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  count: {
    backgroundColor: COLORS.red,
    height: rpx(18),
    paddingLeft: rpx(6),
    paddingRight: rpx(6),
    borderRadius: rpx(9),
    justifyContent: 'center',
  },
  countText: {
    fontSize: rpx(11),
    lineHeight: rpx(11),
    color: COLORS.color_text_base_inverse,
  },
  groupText: {
    fontSize: rpx(16),
    lineHeight: rpx(22),
  },
  key: {
    height: rpx(40),
    justifyContent: 'center',
    paddingLeft: rpx(15),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: rpx(15),
  },
  userName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: COLORS.borderLightColor,
    borderTopWidth: 1,
    height: '100%',
    paddingRight: rpx(15),
  },
  userNameText: {
    fontSize: rpx(15),
  },
  firstUserName: {
    borderTopWidth: 0,
  },
  avatar: {
    paddingTop: rpx(8),
    paddingBottom: rpx(8),
    marginRight: rpx(12),
  },
  avatarImage: {
    width: rpx(42),
    height: rpx(42),
    borderRadius: rpx(4),
  },
});

export default observer(AddressBook);
