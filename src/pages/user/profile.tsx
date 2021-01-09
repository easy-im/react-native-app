import React from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import color from '@/utils/color';
import { rpx } from '@/utils/screen';

const Profile: React.FC<{}> = () => {
  const currentUser = useSelector((state: any) => state.user.currentUser);

  const setting = [
    {
      name: '钱包',
      url: 'https://im.wangcai.me/speedy_wallet.svg',
    },
    {
      name: '收藏',
      url: 'https://im.wangcai.me/speedy_collect.svg',
    },
    {
      name: '设置',
      url: 'https://im.wangcai.me/speedy_setting.svg',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.info}>
        <View style={styles.avatar}>
          <Image
            source={{ uri: `${currentUser.avatar}?imageView2/1/w/150/h/150/format/jpg/interlace/1/q/75` }}
            style={styles.avatarImage}
          />
        </View>
        <View style={styles.content}>
          <View>
            <Text style={styles.nameText}>{currentUser.nickname}</Text>
          </View>
          <View style={styles.id}>
            <Text style={styles.idText}>kitimID：{currentUser.id}</Text>
          </View>
        </View>
        {/* <View style={styles.more}>
          <Icon name="right" size={18} color={color.lightText} />
        </View> */}
      </View>
      <View style={styles.setting}>
        {setting.map((item, index) => {
          return (
            <View style={[styles.settingItem, index === 0 && styles.settingFirstItem]} key={index}>
              <SvgUri uri={item.url} width={rpx(25)} height={rpx(25)} />
              <View style={styles.settingName}>
                <Text style={styles.settingNameText}>{item.name}</Text>
              </View>
              <View style={styles.more}>
                <Icon name="right" size={rpx(18)} color={color.lightText} />
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.logout}>
        <TouchableOpacity style={styles.button} activeOpacity={0.6}>
          <Text style={styles.buttonText}>退出登录</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rpx(20),
    paddingRight: rpx(10),
    backgroundColor: color.white,
  },
  avatar: {
    width: rpx(60),
    height: rpx(60),
    marginRight: rpx(15),
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: rpx(30),
  },
  content: {
    flex: 1,
  },
  nameText: {
    fontSize: rpx(18),
  },
  id: {
    marginTop: rpx(6),
  },
  idText: {
    fontSize: rpx(13),
    color: color.lightGray,
  },
  more: {
    width: rpx(20),
  },
  setting: {
    marginTop: rpx(10),
    backgroundColor: color.white,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rpx(15),
    borderTopColor: color.borderLightColor,
    borderTopWidth: 1,
  },
  settingFirstItem: {
    borderTopWidth: 0,
  },
  settingName: {
    marginLeft: rpx(10),
    marginRight: rpx(10),
    flex: 1,
  },
  settingNameText: {
    fontSize: rpx(14),
    color: color.lightText,
  },
  logout: {
    marginTop: rpx(10),
    padding: rpx(15),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: color.borderLightColor,
    borderWidth: 1,
    height: rpx(44),
    lineHeight: rpx(44),
    backgroundColor: color.white,
    borderRadius: rpx(4),
  },
  buttonText: {
    fontSize: rpx(15),
    color: color.red,
  },
});

export default Profile;
