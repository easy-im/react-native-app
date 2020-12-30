import React from 'react';
import { View, Image, Text, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import color from '@/common/color';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const AddressBook: React.FC<{}> = () => {
  const navigation = useNavigation();
  const friends_map: Record<number, any> = {
    1: {
      avatar: 'https://im.wangcai.me/speedy_avatar_1.jpg',
      nickname: '小白',
    },
    2: {
      avatar: 'https://im.wangcai.me/speedy_avatar_2.jpg',
      nickname: '小红',
    },
  };
  const friends = [
    {
      key: 'X',
      list: [1, 2],
    },
  ];

  const chat2user = (id: number) => {
    navigation.navigate('Chat', { id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header title="通讯录" />
      <View>
        <View style={[styles.card, styles.groups]}>
          <View style={[styles.groupItem, styles.apply]}>
            <View style={styles.image}>
              <Image source={require('@/assets/images/icon/apply.png')} style={styles.icon} />
            </View>
            <View>
              <Text style={styles.groupText}>好友申请</Text>
            </View>
          </View>
          <View style={[styles.groupItem]}>
            <View style={[styles.image, styles.groupImage]}>
              <Image source={require('@/assets/images/icon/group.png')} style={styles.icon} />
            </View>
            <View>
              <Text style={styles.groupText}>我的群组</Text>
            </View>
          </View>
        </View>
        <View>
          {friends.map((item) => {
            return (
              <View key={item.key}>
                <View style={styles.key}>
                  <Text>{item.key}</Text>
                </View>
                <View style={[styles.card]}>
                  {item.list.map((fid, index) => {
                    return (
                      <TouchableWithoutFeedback key={index} onPress={() => chat2user(fid)}>
                        <View style={styles.listItem}>
                          <View style={styles.avatar}>
                            <Image source={{ uri: friends_map[fid].avatar }} style={styles.avatarImage} />
                          </View>
                          <View style={[styles.userName, index === 0 && styles.firstUserName]}>
                            <Text style={styles.userNameText}>{friends_map[fid].nickname}</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  card: {
    backgroundColor: color.white,
    borderTopColor: color.borderLightColor,
    borderTopWidth: 1,
    borderBottomColor: color.borderLightColor,
    borderBottomWidth: 1,
  },
  groups: {
    borderTopWidth: 0,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingLeft: 15,
    paddingRight: 15,
    borderTopColor: color.borderLightColor,
    borderTopWidth: 1,
  },
  apply: {
    borderTopWidth: 0,
  },
  image: {
    width: 22,
    height: 22,
    marginRight: 15,
    backgroundColor: '#ecbe45',
    padding: 5,
  },
  groupImage: {
    backgroundColor: '#27e2e2',
  },
  icon: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  groupText: {
    fontSize: 16,
    lineHeight: 22,
  },
  key: {
    height: 40,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  userName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: color.borderLightColor,
    borderTopWidth: 1,
    height: '100%',
    paddingRight: 15,
  },
  userNameText: {
    fontSize: 15,
  },
  firstUserName: {
    borderTopWidth: 0,
  },
  avatar: {
    paddingTop: 8,
    paddingBottom: 8,
    marginRight: 12,
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 4,
  },
});

export default AddressBook;
