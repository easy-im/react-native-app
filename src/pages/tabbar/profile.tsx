import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, Platform, TouchableOpacity, SafeAreaView } from 'react-native';
import { Toast } from 'react-native-ui-view';
import { observer } from 'mobx-react-lite';
import color from '@/components/library/style';
import Modal from '@/components/library/modal/modal';
import { rpx } from '@/utils/screen';
import { useNavigation } from '@react-navigation/native';
import { MODULES } from '@/core/constant';
import store from '@/store';

const Profile: React.FC<{}> = () => {
  const [modalShow, setModalShow] = useState(false);

  const navigation = useNavigation();
  const { userStore } = store;

  const { userInfo } = userStore;

  const setting = [
    {
      name: '钱包',
      url: require('@/assets/images/wallet.png'),
    },
    {
      name: '收藏',
      url: require('@/assets/images/collect.png'),
    },
    {
      name: '设置',
      url: require('@/assets/images/setting.png'),
    },
  ];

  const logout = async () => {
    setModalShow(false);
    const key = await Toast.loading('处理中...');
    await userStore.logout();
    Toast.hideLoading(key);
    navigation.reset({
      index: 0,
      routes: [
        {
          name: MODULES.Login,
        },
      ],
    });
  };

  if (!userInfo) {
    return null;
  }

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container, Platform.OS === 'ios' && { paddingBottom: -34 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <Modal
        visible={modalShow}
        title="提示"
        content="确认退出登录？"
        onClose={() => setModalShow(false)}
        onConfirm={logout}
      />
      <View style={styles.main}>
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
              <Text style={styles.idText}>手机号：{userInfo.mobile}</Text>
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
                <Image source={item.url} style={styles.settingImage} />
                <View style={styles.settingName}>
                  <Text style={styles.settingNameText}>{item.name}</Text>
                </View>
                <View style={styles.more}>{/* <Icon name="right" size={rpx(18)} color={color.lightText} /> */}</View>
              </View>
            );
          })}
        </View>
        <View style={styles.logout}>
          <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={() => setModalShow(true)}>
            <Text style={styles.buttonText}>退出登录</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.color_text_base_inverse,
  },
  main: {
    flex: 1,
    backgroundColor: color.fill_body,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rpx(20),
    paddingRight: rpx(10),
    backgroundColor: color.color_text_base_inverse,
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
    backgroundColor: color.color_text_base_inverse,
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
  settingImage: {
    width: rpx(25),
    height: rpx(25),
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
    backgroundColor: color.color_text_base_inverse,
    borderRadius: rpx(4),
  },
  buttonText: {
    fontSize: rpx(15),
    color: color.red,
  },
});

export default observer(Profile);
