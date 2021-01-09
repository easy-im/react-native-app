import color from '@/utils/color';
import { rpx } from '@/utils/screen';
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

interface Props {
  title: string;
  loading?: boolean;
}

const Header: React.FC<Props> = (props) => {
  const { title, loading = false } = props;
  return (
    <View style={styles.header}>
      <View style={styles.appName}>
        <Text style={styles.appNameText}>{title}</Text>
        {loading && <ActivityIndicator size="small" color={color.blue} style={styles.loading} />}
      </View>
      <View style={styles.appOperate}>
        <Icon name="pluscircleo" size={20} color={color.text} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: rpx(15),
    paddingRight: rpx(15),
    backgroundColor: color.white,
    height: rpx(48),
    borderBottomColor: color.borderColor,
    borderBottomWidth: 0.5,
  },
  appName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loading: {
    marginLeft: rpx(4),
  },
  appNameText: {
    fontWeight: 'bold',
    fontSize: rpx(16),
  },
  appOperate: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default Header;
