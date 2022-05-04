import React, { useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import color from '@/components/library/style';
import { rpx } from '@/utils/screen';
import SearchBar from '@/components/ui/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { isPhoneNumber } from '@/utils';
import { UserSearch } from '@/service';
import { MODULES } from '@/core/constant';
import { SearchUser } from '@/types/user';
import { observer } from 'mobx-react-lite';
import { Icon, Toast } from 'react-native-ui-view';
import { PageContainer } from '@/router';

const Search: React.FC<{}> = () => {
  const [userData, setUserData] = useState<SearchUser | null | undefined>(undefined);
  const navigation = useNavigation();

  const onSearch = async (text: string) => {
    if (!isPhoneNumber(text)) {
      Toast.info('手机号不正确', 1);
      return;
    }
    const key = await Toast.loading('正在查找联系人');
    const res = await UserSearch(+text);
    Toast.hideLoading(key);
    if (res && res.errno === 200) {
      setUserData(res.data);
    } else {
      setUserData(null);
    }
  };

  const onAddFriend = async (data: SearchUser) => {
    navigation.navigate(MODULES.ApplyToFriend, { userData: data });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={color.fill_body} />
      <View style={styles.searchWrap}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color={color.color_text_paragraph} />
        </TouchableOpacity>
        <SearchBar
          placeholder="请搜索对方手机号"
          style={styles.searchBar}
          theme="light"
          autoFocus={false}
          onSubmitEditing={onSearch}
        />
      </View>
      {userData === null && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>用户不存在</Text>
        </View>
      )}
      {userData && (
        <View style={styles.result}>
          <View style={styles.item}>
            <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            <View style={styles.content}>
              <View>
                <Text style={[styles.contentText, styles.name]}>{userData.nickname}</Text>
              </View>
              <View>
                <Text style={[styles.contentText, styles.mobile]}>手机号：{userData.mobile}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.add, userData.status !== 0 && styles.disabled]}
              onPress={() => onAddFriend(userData)}
              disabled={userData.status !== 0}
            >
              <Text style={styles.addText}>{userData.status === 2 ? '待确认' : '添加'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.fill_body,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rpx(15),
    paddingLeft: rpx(6),
    paddingRight: rpx(15),
    height: rpx(34),
  },
  back: {
    width: rpx(40),
    height: '100%',
  },
  searchBar: {
    flex: 1,
  },
  empty: {
    height: rpx(160),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: rpx(14),
    color: color.lightGray,
  },
  result: {
    marginTop: rpx(15),
    padding: rpx(15),
    backgroundColor: color.color_text_base_inverse,
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
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  contentText: {
    lineHeight: rpx(22),
  },
  name: {
    fontSize: rpx(16),
    color: color.color_text_paragraph,
    fontWeight: '600',
  },
  mobile: {
    fontSize: rpx(13),
    color: color.color_text_disabled,
  },
  add: {
    backgroundColor: color.green,
    padding: rpx(12),
    paddingTop: rpx(5),
    paddingBottom: rpx(5),
    borderRadius: rpx(4),
  },
  addText: {
    fontSize: rpx(16),
    color: color.color_text_base_inverse,
    lineHeight: rpx(21),
  },
  disabled: {
    backgroundColor: color.color_text_disabled,
  },
});

PageContainer(MODULES.Search, observer(Search), {
  title: '添加好友',
  headerShown: false,
});
