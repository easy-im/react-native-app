import color from '@/common/color';
import React from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import { SvgUri } from 'react-native-svg';

const Profile: React.FC<{}> = () => {
  const userInfo = {
    id: 1000,
    avatar: 'https://im.wangcai.me/kitim_avatar_1.jpg',
    nickname: '小白',
  };
  const setting = [
    {
      name: '钱包',
      url: 'https://im.wangcai.me/kitim_wallet.svg',
    },
    {
      name: '收藏',
      url: 'https://im.wangcai.me/kitim_collect.svg',
    },
    {
      name: '隐私',
      url: 'https://im.wangcai.me/kitim_privacy.svg',
    },
    {
      name: '设置',
      url: 'https://im.wangcai.me/kitim_setting.svg',
    },
    {
      name: '联系客服',
      url: 'https://im.wangcai.me/kitim_service.svg',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.info}>
        <View style={styles.avatar}>
          <Image
            source={{ uri: `${userInfo.avatar}?imageView2/1/w/150/h/150/format/jpg/interlace/1/q/75` }}
            style={styles.avatarImage}
          />
        </View>
        <View style={styles.content}>
          <View>
            <Text style={styles.nameText}>{userInfo.nickname}</Text>
          </View>
          <View style={styles.id}>
            <Text style={styles.idText}>kitimID：{userInfo.id}</Text>
          </View>
        </View>
        <View style={styles.more}>
          <Icon name="right" size={18} color="#333" />
        </View>
      </View>
      <View style={styles.setting}>
        {setting.map((item, index) => {
          return (
            <View style={styles.settingItem} key={index}>
              <SvgUri uri={item.url} width={25} height={25} />
              <View style={styles.settingName}>
                <Text style={styles.settingNameText}>{item.name}</Text>
              </View>
              <View style={styles.more}>
                <Icon name="right" size={18} color="#333" />
              </View>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingRight: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  content: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
  },
  id: {
    marginTop: 6,
  },
  idText: {
    fontSize: 13,
    color: color.lightGray,
  },
  more: {
    width: 20,
  },
  setting: {
    marginTop: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopColor: color.borderLightColor,
    borderTopWidth: 1,
  },
  settingName: {
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
  },
  settingNameText: {
    fontSize: 14,
  },
});

export default Profile;
