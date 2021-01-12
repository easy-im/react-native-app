import React, { useState } from 'react';
import { View, Image, Text, TextInput, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Portal, Toast } from '@ant-design/react-native';
import color from '@/utils/color';
import MODULES from '@/router/MODULES';
import { isPhoneNumber } from '@/utils';
import { UserRegister } from '@/service';
import { rpx } from '@/utils/screen';

const Register: React.FC<{}> = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const navigation = useNavigation();

  const register = async () => {
    if (!isPhoneNumber(mobile)) {
      Toast.fail('手机号不正确', 1);
    } else if (!password || password.length < 5 || password.length > 18) {
      Toast.fail('密码格式不正确', 1);
    } else if (password !== password2) {
      Toast.fail('两次密码不相同', 1);
    } else {
      const key = Toast.loading('正在加载');
      const res = await UserRegister(mobile, password);
      Portal.remove(key);
      if (res && res.errno === 200) {
        Toast.success('注册成功，请登录', 1);
        setTimeout(() => {
          navigation.navigate(MODULES.Login);
        }, 1000);
      } else {
        Toast.fail(res?.errmsg || '网络错误', 1);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={color.white} />
      <View style={styles.logo}>
        <Image source={require('@/assets/images/logo.png')} style={styles.image} />
      </View>
      <View style={styles.welcome}>
        <Text style={styles.welcomeText}>欢迎注册KitIM账号</Text>
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
            <Text style={styles.title}>密码</Text>
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              keyboardType="default"
              placeholder="请输入5-18位密码"
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
              placeholder="请输入5-18位密码"
              style={styles.input}
              secureTextEntry={true}
              value={password2}
              onChangeText={(text) => setPassword2(text)}
            />
          </View>
        </View>
        <View style={styles.submit}>
          <Button type="primary" onPress={register}>
            注册
          </Button>
        </View>
        <View style={styles.helpWrap}>
          <TouchableOpacity style={styles.help} onPress={() => navigation.navigate(MODULES.Login)}>
            <Text style={styles.helpText}>已有账号？去登陆</Text>
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

export default Register;
