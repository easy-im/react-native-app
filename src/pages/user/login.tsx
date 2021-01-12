import React, { useState } from 'react';
import { View, Image, Text, TextInput, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Button, Toast, Portal } from '@ant-design/react-native';
import color from '@/utils/color';
import { isPhoneNumber } from '@/utils';
import { UserLogin } from '@/store/reducer/user';
import MODULES from '@/router/MODULES';
import { rpx } from '@/utils/screen';

const Login: React.FC<{}> = () => {
  const [mobile, setMobile] = useState('13600000003');
  const [password, setPassword] = useState('admin');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const doLogin = async () => {
    const key = Toast.loading('正在加载');
    const res: any = await dispatch(UserLogin({ mobile, password }));
    Portal.remove(key);
    if (!res.success) {
      Toast.info(res.errmsg);
      return;
    }
    navigation.reset({
      index: 0,
      routes: [
        {
          name: MODULES.TabNav,
        },
      ],
    });
  };

  const isValid = () => {
    return isPhoneNumber(+mobile) && password.length >= 5 && password.length < 20;
  };

  const valid = isValid();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={color.white} />
      <View style={styles.logo}>
        <Image source={require('@/assets/images/logo.png')} style={styles.image} />
      </View>
      <View style={styles.welcome}>
        <Text style={styles.welcomeText}>欢迎使用KitIM</Text>
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
              placeholder="请输入5-20位密码"
              value={password}
              style={styles.input}
              secureTextEntry={true}
              onChangeText={(t) => setPassword(t)}
            />
          </View>
        </View>
        <View style={styles.submit}>
          <Button type="primary" onPress={doLogin} disabled={!valid}>
            登录
          </Button>
        </View>
        <View style={styles.helpWrap}>
          <TouchableOpacity style={styles.help} onPress={() => navigation.navigate(MODULES.Register)}>
            <Text style={styles.helpText}>注册账号</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: rpx(40),
    paddingRight: rpx(40),
    backgroundColor: color.white,
  },
  logo: {
    marginTop: rpx(100),
  },
  image: {
    width: rpx(48),
    height: rpx(48),
    borderWidth: 0.5,
    borderColor: color.borderColor,
    borderRadius: rpx(24),
  },
  welcome: {
    marginTop: rpx(20),
  },
  welcomeText: {
    fontSize: rpx(20),
    color: color.text,
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
    padding: rpx(10),
    paddingLeft: 0,
    paddingRight: 0,
    height: rpx(40),
    borderBottomColor: color.borderColor,
    borderBottomWidth: 0.5,
  },
  input: {
    fontSize: rpx(15),
    backgroundColor: 'transparent',
    padding: 0,
    height: '100%',
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
    color: color.lightGray,
    fontSize: rpx(13),
  },
});

export default Login;
