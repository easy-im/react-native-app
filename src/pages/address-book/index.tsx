import React from 'react';
import { View, Image, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Header from '@/components/Header';
import color from '@/utils/color';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { UserState } from '@/store/reducer/user';
import { Friend } from '@/types/interface/user';
import MODULES from '@/router/MODULES';

const AddressBook: React.FC<{}> = () => {
  const navigation = useNavigation();
  const friendMap = useSelector((state: { user: UserState }) => state.user.friendMap);
  const friendList = useSelector((state: { user: UserState }) => state.user.friendList);

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
                              <Text style={styles.userNameText}>{friend?.nickname}</Text>
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
    backgroundColor: color.white,
  },
  main: {
    flex: 1,
    backgroundColor: color.background,
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
    width: 24,
    height: 24,
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
