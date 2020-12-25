import React from 'react';
import {View, Button, StyleSheet, StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Login: React.FC<{}> = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" />
      <Button title="跳转到个人中心" onPress={() => navigation.navigate('TabNav', {screen: 'Profile'})} />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
