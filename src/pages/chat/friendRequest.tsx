import React from 'react';
import { Image, StatusBar, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import SearchBar from '@/components/SearchBar';
import { rpx } from '@/utils/screen';
import COLORS from '@/core/color';
import { P_ADD_FRIEND, P_FRIEND_REQUEST, P_SEARCH, ScreenProp } from '@/core/constant';
import { DealFriendRequest } from '@/service';
import { UserFriendRequest } from '@/types/user';
import store from '@/store';
import { PageContainer } from '@/router';
import { Toast } from 'react-native-ui-view';
import config from '@/config';

// 好友申请
const RequestList: React.FC<{}> = () => {
  const navigation = useNavigation<ScreenProp>();
  const { userStore } = store;
  const { userFriendRequest, userFriendRequestCount } = userStore;

  const handle = async (record: UserFriendRequest, agree: boolean) => {
    if (agree) {
      navigation.navigate(P_ADD_FRIEND, { userData: record });
    } else {
      const key = await Toast.loading('正在处理');
      const res = await DealFriendRequest(record.id, agree);
      if (res && res.errno === 200) {
        await userStore.setUserFriendRequest(
          userFriendRequest.map((item) => {
            if (item.id === record.id) {
              item.status = 2;
            }
            return item;
          }),
        );
        await userStore.setUserFriendRequestCount(userFriendRequestCount - 1);
        Toast.hideLoading(key);
        Toast.success('已回绝', 1000);
      } else {
        Toast.hideLoading(key);
        Toast.fail(res?.errmsg || '网络错误', 1000);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.fill_body} />
      <View style={styles.searchWrap}>
        <SearchBar
          placeholder="搜索对方手机号"
          style={styles.searchBar}
          theme="light"
          disabled={true}
          onPress={() => navigation.navigate(P_SEARCH)}
        />
      </View>
      {userFriendRequest && userFriendRequest.length > 0 && (
        <View style={styles.result}>
          {userFriendRequest.map((item, index) => {
            return (
              <View style={styles.item} key={index}>
                <Image source={{ uri: `${config.cdnUrl}${item.avatar}` }} style={styles.avatar} />
                <View style={styles.contentWrap}>
                  <View style={styles.content}>
                    <View>
                      <Text style={[styles.contentText, styles.name]}>{item.nickname}</Text>
                    </View>
                    <View>
                      <Text style={[styles.contentText, styles.message]} ellipsizeMode="tail" numberOfLines={1}>
                        {item.message}
                      </Text>
                    </View>
                  </View>
                  {item.status === 0 && (
                    <View style={styles.buttonList}>
                      <TouchableOpacity style={styles.refuseButton} onPress={() => handle(item, false)}>
                        <Text style={styles.refuseButtonText}>拒绝</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.agreeButton} onPress={() => handle(item, true)}>
                        <Text style={styles.agreeButtonText}>同意</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {item.status === 1 && <Text style={styles.processedText}>已添加</Text>}
                  {item.status === 2 && <Text style={styles.processedText}>已回绝</Text>}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.fill_body,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rpx(15),
    paddingLeft: rpx(6),
    paddingRight: rpx(15),
    height: rpx(34),
  },
  searchBar: {
    flex: 1,
  },
  result: {
    marginTop: rpx(15),
    paddingLeft: rpx(15),
    paddingRight: rpx(15),
    backgroundColor: COLORS.color_text_base_inverse,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: rpx(42),
    height: rpx(42),
    marginRight: rpx(12),
    borderRadius: rpx(4),
  },
  contentWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  name: {
    fontSize: rpx(16),
    color: COLORS.color_text_paragraph,
    fontWeight: '600',
  },
  message: {
    fontSize: rpx(13),
    color: COLORS.color_text_disabled,
  },
  buttonList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refuseButton: {
    backgroundColor: COLORS.color_text_base_inverse,
    padding: rpx(10),
    paddingTop: rpx(4),
    paddingBottom: rpx(4),
    borderRadius: rpx(4),
    borderColor: COLORS.color_text_disabled,
    borderWidth: 0.5,
  },
  refuseButtonText: {
    fontSize: rpx(14),
    color: COLORS.lightGray,
    lineHeight: rpx(21),
  },
  agreeButton: {
    backgroundColor: COLORS.green,
    padding: rpx(10),
    paddingTop: rpx(4),
    paddingBottom: rpx(4),
    borderRadius: rpx(4),
    marginLeft: rpx(8),
  },
  agreeButtonText: {
    fontSize: rpx(14),
    color: COLORS.color_text_base_inverse,
    lineHeight: rpx(21),
  },
  processedText: {
    fontSize: rpx(14),
    color: COLORS.lightGray,
  },
});

PageContainer(P_FRIEND_REQUEST, observer(RequestList), {
  title: '新的朋友',
  headerStyle: {
    height: Platform.OS === 'android' ? 44 : undefined, // ios设置会错乱
    backgroundColor: COLORS.fill_body,
  },
});
