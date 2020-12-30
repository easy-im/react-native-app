import React from 'react';
import { View, Image, Text, TextInput, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import color from '@/common/color';

const Login: React.FC<{}> = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.logo}>
        <Image source={require('@/assets/images/logo.png')} style={styles.image} />
      </View>
      <View style={styles.welcome}>
        <Text style={styles.welcomeText}>欢迎注册快聊账号</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.formItem}>
          <View>
            <Text style={styles.title}>手机号码</Text>
          </View>
          <View style={styles.inputWrap}>
            <TextInput style={styles.input} keyboardType="phone-pad" autoFocus={true} placeholder="请输入手机号码" />
          </View>
        </View>
        <View style={styles.formItem}>
          <View>
            <Text style={styles.title}>密码</Text>
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              keyboardType="default"
              secureTextEntry={true}
              placeholder="请输入5-20位密码"
            />
          </View>
        </View>
        <View style={styles.formItem}>
          <View>
            <Text style={styles.title}>重复密码</Text>
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              keyboardType="default"
              secureTextEntry={true}
              placeholder="请输入5-20位密码"
            />
          </View>
        </View>
        <View style={styles.submit}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>注册</Text>
          </View>
        </View>
        <View style={styles.helpWrap}>
          <TouchableOpacity style={styles.help} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signUp}>已有账号</Text>
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
    marginTop: 6,
  },
  input: {
    borderBottomColor: '#eaeaea',
    borderBottomWidth: 1,
    height: 39,
    lineHeight: 39,
    fontSize: 15,
    backgroundColor: 'transparent',
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