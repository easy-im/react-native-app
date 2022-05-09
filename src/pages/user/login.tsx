import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { Toast, Button } from 'react-native-ui-view';
import COLORS from '@/core/color';
import { isPhoneNumber } from '@/utils';
import Socket from '@/socket/chat';

import { P_HOME, P_LOGIN, P_REGISTER, ScreenProp } from '@/core/constant';
import { rpx } from '@/utils/screen';
import store from '@/store';
import config from '@/config';
import { PageContainer } from '@/router';

const Login: React.FC<{}> = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation<ScreenProp>();
  const { userStore } = store;

  const doLogin = async () => {
    Keyboard.dismiss();
    const key = await Toast.loading('登陆中');
    const res: any = await userStore.login(mobile, password);
    Toast.hideLoading(key);
    if (!res.success) {
      Toast.info(res.errmsg);
      return;
    }
    // 登陆成功链接ws
    await Socket.setup();
    navigation.reset({
      index: 0,
      routes: [
        {
          name: P_HOME,
        },
      ],
    });
  };

  const isValid = () => {
    return isPhoneNumber(+mobile) && password.length >= 6 && password.length <= 18;
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding', android: 'height' })}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.color_text_base_inverse} />
      <ScrollView style={styles.main} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
        <View style={styles.logo}>
          <Image source={require('@/assets/images/logo.png')} style={styles.image} />
        </View>
        <View style={styles.welcome}>
          <Text style={styles.welcomeText}>欢迎使用{config.appName}</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.formItem}>
            <View>
              <Text style={styles.title}>手机号码</Text>
            </View>
            <View style={styles.inputWrap}>
              <TextInput
                keyboardType="phone-pad"
                placeholder="请输入手机号码"
                style={styles.input}
                value={mobile}
                maxLength={11}
                onChangeText={(t) => setMobile(t)}
              />
            </View>
          </View>
          <View style={styles.formItem}>
            <View>
              <Text style={styles.title}>密码</Text>
            </View>
            <View style={styles.inputWrap}>
              <TextInput
                keyboardType="default"
                placeholder="请输入6-18位密码"
                value={password}
                style={styles.input}
                secureTextEntry={true}
                onChangeText={(t) => setPassword(t)}
              />
            </View>
          </View>
          <View style={styles.submit}>
            <Button type="primary" onPress={doLogin} disabled={!isValid()}>
              登录
            </Button>
          </View>
          <View style={styles.helpWrap}>
            <TouchableOpacity style={styles.help} onPress={() => navigation.navigate(P_REGISTER)}>
              <Text style={styles.helpText}>注册账号</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    paddingLeft: rpx(40),
    paddingRight: rpx(40),
    backgroundColor: COLORS.color_text_base_inverse,
  },
  logo: {
    marginTop: rpx(100),
  },
  image: {
    width: rpx(60),
    height: rpx(60),
    borderWidth: 0.5,
    borderColor: COLORS.borderColor,
    borderRadius: rpx(30),
  },
  welcome: {
    marginTop: rpx(20),
  },
  welcomeText: {
    fontSize: rpx(20),
    color: COLORS.color_text_paragraph,
  },
  form: {
    marginTop: rpx(25),
  },
  formItem: {
    marginTop: rpx(10),
  },
  title: {
    fontSize: rpx(13),
    color: '#444',
  },
  inputWrap: {
    height: rpx(44),
    borderBottomColor: COLORS.borderColor,
    borderBottomWidth: 0.5,
  },
  input: {
    fontSize: rpx(15),
    backgroundColor: 'transparent',
    padding: rpx(10),
    paddingLeft: 0,
    paddingRight: 0,
  },
  submit: {
    marginTop: rpx(40),
  },
  helpWrap: {
    marginTop: rpx(10),
    flexDirection: 'row',
  },
  help: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  helpText: {
    color: COLORS.lightGray,
    fontSize: rpx(13),
  },
});

PageContainer(P_LOGIN, observer(Login), {
  headerShown: false,
});
