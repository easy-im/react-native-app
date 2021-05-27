import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { Portal, Toast } from '@ant-design/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import color from '@/components/library/style/theme';
import { rpx } from '@/utils/screen';
import { UserFriendRequest } from '@/types/interface/user';
import { GetUserFriendList, SET_USER_FRIEND_REQUEST, UserState } from '@/store/reducer/user';
import { DealFriendRequest } from '@/service';
import MODULES from '@/router/MODULES';

const AddFriend: React.FC<{}> = () => {
  const [remark, setRemark] = useState('');

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { params = {} }: any = route;
  const { userData }: { userData: UserFriendRequest } = params;
  const userFriendRequest = useSelector((state: { user: UserState }) => state.user.userFriendRequest);
  const userFriendRequestCount = useSelector((state: { user: UserState }) => state.user.userFriendRequestCount);
  const currentUser = useSelector((state: { user: UserState }) => state.user.currentUser);

  useEffect(() => {
    setRemark(userData?.nickname);
  }, [currentUser, userData]);

  const onAddFriend = async () => {
    const key = Toast.loading('正在处理');
    const res = await DealFriendRequest(userData.id, true, remark);
    if (res && res.errno === 200) {
      await dispatch({
        type: SET_USER_FRIEND_REQUEST,
        payload: {
          userFriendRequest: userFriendRequest.map((item) => {
            if (item.id === userData.id) {
              item.status = 1;
            }
            return item;
          }),
          userFriendRequestCount: userFriendRequestCount - 1,
        },
      });
      await dispatch(GetUserFriendList());
      Portal.remove(key);
      Toast.success('已添加', 1);
      setTimeout(() => {
        navigation.reset({
          index: 1,
          routes: [
            {
              name: MODULES.Recent,
            },
            {
              name: MODULES.Chat,
              params: { id: userData.uid, title: remark || userData.nickname },
            },
          ],
        });
      }, 1000);
    } else {
      Portal.remove(key);
      Toast.fail(res?.errmsg || '网络错误', 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={color.fill_body} />
      <View style={styles.headerWrap}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name="md-chevron-back" size={28} color={color.color_text_paragraph} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.done} onPress={() => onAddFriend()}>
          <Text style={styles.doneText}>完成</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        <View>
          <Text style={styles.titleText}>通过好友验证</Text>
        </View>
        <View style={styles.formItem}>
          <View>
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
          <View style={styles.message}>
            <Text style={styles.messageText}>好友发来的消息：{userData.message}</Text>
            <Pressable onPress={() => setRemark(userData.message)} style={styles.fill}>
              <Text style={styles.fillText}>填入</Text>
            </Pressable>
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
  done: {
    backgroundColor: color.green,
    padding: rpx(12),
    paddingTop: rpx(5),
    paddingBottom: rpx(5),
    borderRadius: rpx(4),
  },
  doneText: {
    fontSize: rpx(16),
    color: color.color_text_base_inverse,
    lineHeight: rpx(21),
  },
  main: {
    marginTop: rpx(40),
    padding: rpx(15),
  },
  titleText: {
    fontSize: rpx(18),
    color: color.color_text_paragraph,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  formItem: {
    marginTop: rpx(30),
  },
  tipText: {
    color: color.lightGray,
    fontSize: rpx(14),
  },
  inputWrap: {
    marginTop: rpx(12),
  },
  input: {
    textAlignVertical: 'top',
    borderRadius: rpx(4),
    padding: rpx(12),
    paddingBottom: rpx(6),
    backgroundColor: color.borderColor,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rpx(8),
  },
  messageText: {
    fontSize: rpx(13),
    color: color.color_text_disabled,
  },
  fill: {
    marginLeft: rpx(8),
  },
  fillText: {
    fontSize: rpx(13),
    color: color.lightBlue,
  },
});

export default AddFriend;
