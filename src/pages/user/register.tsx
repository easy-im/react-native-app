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
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { Toast, Button } from 'react-native-ui-view';
import COLORS from '@/core/color';
import { P_LOGIN, P_REGISTER, ScreenProp } from '@/core/constant';
import { isPhoneNumber } from '@/utils';
import { UserRegister } from '@/service';
import { rpx } from '@/utils/screen';
import config from '@/config';
import { PageContainer } from '@/router';

const Register: React.FC<{}> = () => {
  const [mobile, setMobile] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const navigation = useNavigation<ScreenProp>();

  const register = async () => {
    if (!isPhoneNumber(mobile)) {
      Toast.fail('手机号不正确', 1000);
    } else if (!password || password.length < 6 || password.length > 18) {
      Toast.fail('密码格式不正确', 1000);
    } else if (password !== password2) {
      Toast.fail('两次密码不相同', 1000);
    } else {
      const key = await Toast.loading('正在加载');
      const res = await UserRegister(mobile, nickname, password);
      Toast.hideLoading(key);
      if (res && res.errno === 200) {
        Toast.success('注册成功，请登录', 1000);
        setTimeout(() => {
          navigation.navigate(P_LOGIN);
        }, 1000);
      } else {
        Toast.fail(res?.errmsg || '网络错误', 1000);
      }
    }
  };

  const isValid = () => {
    return (
      isPhoneNumber(+mobile) && password.length >= 6 && password.length <= 18 && password === password2 && nickname
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding', android: 'height' })}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.color_text_base_inverse} />
      <ScrollView style={styles.main} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
        <View style={styles.logo}>
          <Image source={require('@/assets/images/logo.png')} style={styles.image} />
        </View>
        <View style={styles.welcome}>
          <Text style={styles.welcomeText}>欢迎注册{config.appName}账号</Text>
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
                onChangeText={(text) => setMobile(text)}
              />
            </View>
          </View>
          <View style={styles.formItem}>
            <View>
              <Text style={styles.title}>昵称</Text>
            </View>
            <View style={styles.inputWrap}>
              <TextInput
                placeholder="请输入昵称"
                style={styles.input}
                value={nickname}
                onChangeText={(text) => setNickname(text)}
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
                style={styles.input}
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
          </View>
          <View style={styles.formItem}>
            <View>
              <Text style={styles.title}>重复密码</Text>
            </View>
            <View style={styles.inputWrap}>
              <TextInput
                keyboardType="default"
                placeholder="请输入6-18位密码"
                style={styles.input}
                secureTextEntry={true}
                value={password2}
                onChangeText={(text) => setPassword2(text)}
              />
            </View>
          </View>
          <View style={styles.submit}>
            <Button type="primary" onPress={register} disabled={!isValid()}>
              注册
            </Button>
          </View>
          <View style={styles.helpWrap}>
            <TouchableOpacity style={styles.help} onPress={() => navigation.navigate(P_LOGIN)}>
              <Text style={styles.helpText}>已有账号？去登陆</Text>
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

PageContainer(P_REGISTER, observer(Register), {
  headerShown: false,
});
