import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, TextInput, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Toast } from 'react-native-ui-view';
import { observer } from 'mobx-react-lite';
import COLORS from '@/core/color';
import { rpx } from '@/utils/screen';
import { RequestToBeFriend } from '@/service';
import { SearchUser } from '@/types/user';
import store from '@/store';
import { MODULES } from '@/core/constant';
import { PageContainer } from '@/router';

// 申请添加好友
const ApplyToFriend: React.FC<{}> = () => {
  const [message, setMessage] = useState('');
  const [remark, setRemark] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const { userStore } = store;

  const { params = {} }: any = route;
  const { userData }: { userData: SearchUser } = params;

  const { userInfo } = userStore;

  useEffect(() => {
    setMessage(`我是${userInfo?.nickname}`);
    setRemark(userData?.nickname);
  }, [userInfo, userData]);

  const onAddFriend = async () => {
    if (userData.status === 0) {
      const key = await Toast.loading('正在发送请求');
      const res = await RequestToBeFriend({ fid: userData.id, remark, message });
      Toast.hideLoading(key);
      if (res && res.errno === 200) {
        Toast.success('请求已发送', 1000);
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      } else {
        Toast.fail(res?.errmsg || '网络错误', 1000);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.fill_body} />
      <View style={styles.headerWrap}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          {/* <Icon name="md-chevron-back" size={28} color={COLORS.color_text_paragraph} /> */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.send} onPress={() => onAddFriend()}>
          <Text style={styles.sendText}>发送</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        <View style={styles.title}>
          <Text style={styles.titleText}>申请添加好友</Text>
        </View>
        <View style={styles.formItem}>
          <View style={styles.tip}>
            <Text style={styles.tipText}>发送好友申请</Text>
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              autoCapitalize="none"
              returnKeyType="done"
              multiline
              numberOfLines={3}
              maxLength={50}
              style={styles.input}
              value={message}
              onChangeText={(t) => setMessage(t)}
            />
          </View>
        </View>
        <View style={[styles.formItem, styles.remark]}>
          <View style={styles.tip}>
            <Text style={styles.tipText}>设置备注</Text>
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              autoCapitalize="none"
              returnKeyType="done"
              maxLength={20}
              style={styles.input}
              value={remark}
              onChangeText={(t) => setRemark(t)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.fill_body,
  },
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: rpx(15),
    paddingLeft: rpx(6),
    paddingRight: rpx(15),
    height: rpx(34),
  },
  back: {
    width: rpx(40),
    height: '100%',
  },
  send: {
    backgroundColor: COLORS.green,
    padding: rpx(12),
    paddingTop: rpx(5),
    paddingBottom: rpx(5),
    borderRadius: rpx(4),
  },
  sendText: {
    fontSize: rpx(16),
    color: COLORS.color_text_base_inverse,
    lineHeight: rpx(21),
  },
  main: {
    marginTop: rpx(40),
    padding: rpx(15),
  },
  title: {},
  titleText: {
    fontSize: rpx(18),
    color: COLORS.color_text_paragraph,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  formItem: {
    marginTop: rpx(30),
  },
  remark: {
    marginTop: rpx(50),
  },
  tip: {},
  tipText: {
    color: COLORS.lightGray,
    fontSize: rpx(14),
  },
  inputWrap: {
    marginTop: rpx(12),
  },
  input: {
    // borderWidth: 0.5,
    // borderColor: '#ccc',
    textAlignVertical: 'top',
    borderRadius: rpx(4),
    padding: rpx(12),
    backgroundColor: COLORS.borderColor,
  },
});

PageContainer(MODULES.ApplyToFriend, observer(ApplyToFriend), {
  title: '好友申请',
  headerShown: false,
});
