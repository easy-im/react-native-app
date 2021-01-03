import React, { useState } from 'react';
import { View, Image, Text, TextInput, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import color from '@/common/color';
import { isPhoneNumber } from '@/utils';
import request from '@/utils/request';
import UserStorage from '@/storage/user';

const Login: React.FC<{}> = () => {
  const [mobile, setMobile] = useState('13600000000');
  const [password, setPassword] = useState('admin');
  const navigation = useNavigation();

  const doLogin = async () => {
    const res = await request.put('/user/signIn', {
      mobile,
      password,
    });
    if (res && res.errno === 200) {
      UserStorage.saveUser({
        is_current: 1,
        ...res.data,
      });
    }
  };

  const isValid = () => {
    return isPhoneNumber(+mobile) && password.length >= 5 && password.length < 20;
  };

  const valid = isValid();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.logo}>
        <Image source={require('@/assets/images/logo.png')} style={styles.image} />
      </View>
      <View style={styles.welcome}>
        <Text style={styles.welcomeText}>欢迎使用快聊</Text>
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
          <TouchableOpacity onPress={doLogin} disabled={!valid}>
            <View style={[styles.button, !valid && styles.disabledButton]}>
              <Text style={styles.buttonText}>登录</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.helpWrap}>
          <TouchableOpacity style={styles.help} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUp}>注册账号</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: '#fff',
  },
  logo: {
    marginTop: 100,
  },
  image: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: color.borderColor,
    borderRadius: 24,
  },
  welcome: {
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 20,
    color: '#333',
  },
  form: {
    marginTop: 25,
  },
  formItem: {
    marginTop: 10,
  },
  title: {
    fontSize: 13,
    color: '#444',
  },
  inputWrap: {
    padding: 10,
    paddingLeft: 0,
    paddingRight: 0,
    height: 40,
    borderBottomColor: '#eaeaea',
    borderBottomWidth: 1,
  },
  input: {
    fontSize: 15,
    backgroundColor: 'transparent',
    padding: 0,
    height: '100%',
  },
  submit: {
    marginTop: 15,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.lightBlue,
    height: 45,
    lineHeight: 45,
    borderRadius: 6,
    opacity: 1,
  },
  disabledButton: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  signUp: {
    color: color.lightGray,
    fontSize: 13,
  },
  helpWrap: {
    marginTop: 9,
  },
  help: {
    justifyContent: 'flex-end',
  },
});

export default Login;
