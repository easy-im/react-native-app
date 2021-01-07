import React from 'react';
import { View, StyleSheet, StatusBar, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import color from '@/utils/color';

const Recent: React.FC<{}> = () => {
  const navigation = useNavigation();
  const list = [
    {
      id: 1,
      unread_number: 1,
      friend_info: {
        avatar: 'https://im.wangcai.me/speedy_avatar_5.jpg',
        nickname: '小⑦',
      },
      last_message: {
        content: '你好啊，我是小白',
        time: '2小时前',
      },
    },
    {
      id: 2,
      unread_number: 1,
      friend_info: {
        avatar: 'https://im.wangcai.me/speedy_avatar_2.jpg',
        nickname: '小白',
      },
      last_message: {
        content: '你好啊，我是小白,你好啊，我是小白,你好啊，我是小白,你好啊，我是小白',
        time: '2小时前',
      },
    },
  ];

  const chat2user = (item: any) => {
    navigation.navigate('Chat', { id: item.id, title: item.friend_info.nickname });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <Header title="KitIM" />
      <View style={styles.main}>
        <SearchBar placeholder="请输入关键字" disabled />
        <View style={styles.list}>
          {list.map((item) => {
            return (
              <TouchableWithoutFeedback onPress={() => chat2user(item)} key={item.id}>
                <View style={styles.listItem}>
                  <View style={styles.avatar}>
                    <Image source={{ uri: item.friend_info.avatar }} style={styles.avatarImage} />
                    {/* <u-badge type="error" :count="item.unread_number" :offset="[-10, -10]" /> */}
                  </View>
                  <View style={styles.wrap}>
                    <View style={styles.content}>
                      <View>
                        <Text style={styles.userName}>{item.friend_info.nickname}</Text>
                      </View>
                      <View>
                        <Text style={styles.message} numberOfLines={1}>
                          {item.last_message.content}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.time}>{item.last_message.time}</Text>
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
    backgroundColor: '#fff',
  },
  main: {
    padding: 15,
  },
  list: {
    marginTop: 5,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    position: 'relative',
    width: 42,
    height: 42,
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  wrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: color.borderLightColor,
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  content: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  message: {
    fontSize: 13,
    color: '#999',
  },
  time: {
    color: '#999',
    marginLeft: 13,
  },
});

export default Recent;
