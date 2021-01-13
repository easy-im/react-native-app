import React, { useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { Portal, Toast } from '@ant-design/react-native';
import color from '@/utils/color';
import { rpx } from '@/utils/screen';
import SearchBar from '@/components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { isPhoneNumber } from '@/utils';
import { UserSearch } from '@/service';

interface SearchUser {
  id: number;
  nickname: string;
  mobile: number;
  avatar: string;
  status: 0 | 1;
}
const Search: React.FC<{}> = () => {
  const [user, setUser] = useState<SearchUser | null | undefined>(undefined);
  const navigation = useNavigation();

  const onSearch = async (text: string) => {
    if (!isPhoneNumber(text)) {
      Toast.info('手机号不正确', 1);
      return;
    }
    const key = Toast.loading('正在查找联系人');
    const res = await UserSearch(+text);
    Portal.remove(key);
    if (res && res.errno === 200) {
      setUser(res.data);
    } else {
      setUser(null);
    }
  };

  const onAddFriend = (data: SearchUser) => {
    console.log(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={color.background} />
      <View style={styles.searchWrap}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name="md-chevron-back" size={28} color={color.text} />
        </TouchableOpacity>
        <SearchBar
          placeholder="请搜索对方手机号"
          style={styles.searchBar}
          theme="light"
          autoFocus={true}
          onSubmitEditing={onSearch}
        />
      </View>
      {user === null && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>用户不存在</Text>
        </View>
      )}
      {user && (
        <View style={styles.result}>
          <View style={styles.item}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.content}>
              <View>
                <Text style={[styles.contentText, styles.name]}>{user.nickname}</Text>
              </View>
              <View>
                <Text style={[styles.contentText, styles.mobile]}>手机号：{user.mobile}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.add, user.status !== 1 && styles.disabled]}
              onPress={() => onAddFriend(user)}
              disabled={user.status !== 1}
            >
              <Text style={styles.addText}>添加</Text>
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
    backgroundColor: color.background,
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
    backgroundColor: color.white,
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
    color: color.text,
    fontWeight: '600',
  },
  mobile: {
    fontSize: rpx(13),
    color: color.gray,
  },
  add: {
    backgroundColor: color.green,
    padding: rpx(12),
    paddingTop: rpx(5),
    paddingBottom: rpx(5),
    borderRadius: rpx(6),
  },
  addText: {
    fontSize: rpx(16),
    color: color.white,
    lineHeight: rpx(21),
  },
  disabled: {
    backgroundColor: color.gray,
  },
});

export default Search;
