import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

interface Props {}
const Header: React.FC<Props> = () => {
  return (
    <View style={styles.header}>
      <View style={styles.appName}>
        <Text style={styles.appNameText}>快聊</Text>
      </View>
      <View style={styles.appOperate}>
        <Icon name="pluscircleo" size={20} color="#333" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#FFF',
    height: 48,
    borderBottomColor: '#eaeaea',
    borderBottomWidth: 1,
  },
  appName: {
    flex: 1,
  },
  appNameText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  appOperate: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default Header;
