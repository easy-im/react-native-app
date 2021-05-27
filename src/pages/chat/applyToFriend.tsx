import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { Portal, Toast } from '@ant-design/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import color from '@/components/library/style/theme';
import { rpx } from '@/utils/screen';
import { RequestToBeFriend } from '@/service';
import { SearchUser } from '@/types/interface/user';
import { UserState } from '@/store/reducer/user';

const ApplyToFriend: React.FC<{}> = () => {
  const [message, setMessage] = useState('');
  const [remark, setRemark] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const { params = {} }: any = route;
  const { userData }: { userData: SearchUser } = params;
  const currentUser = useSelector((state: { user: UserState }) => state.user.currentUser);

  useEffect(() => {
    setMessage(`我是${currentUser?.nickname}`);
    setRemark(userData?.nickname);
  }, [currentUser, userData]);

  const onAddFriend = async () => {
    if (userData.status === 0) {
      const key = Toast.loading('正在发送请求');
      const res = await RequestToBeFriend({ fid: userData.id, remark, message });
      Portal.remove(key);
      if (res && res.errno === 200) {
        Toast.success('请求已发送', 1);
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      } else {
        Toast.fail(res?.errmsg || '网络错误', 1);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={color.fill_body} />
      <View style={styles.headerWrap}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name="md-chevron-back" size={28} color={color.color_text_paragraph} />
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
    backgroundColor: color.fill_body,
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
    backgroundColor: color.green,
    padding: rpx(12),
    paddingTop: rpx(5),
    paddingBottom: rpx(5),
    borderRadius: rpx(4),
  },
  sendText: {
    fontSize: rpx(16),
    color: color.color_text_base_inverse,
    lineHeight: rpx(21),
  },
  main: {
    marginTop: rpx(40),
    padding: rpx(15),
  },
  title: {},
  titleText: {
    fontSize: rpx(18),
    color: color.color_text_paragraph,
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
    color: color.lightGray,
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
    backgroundColor: color.borderColor,
  },
});

export default ApplyToFriend;
