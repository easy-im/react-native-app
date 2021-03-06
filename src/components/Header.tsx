import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import COLORS from '@/core/color';
import { rpx } from '@/utils/screen';
import MenuLayer from './MenuLayer';
import { Icon } from 'react-native-ui-view';

interface Props {
  title: string;
  loading?: boolean;
}

const Header: React.FC<Props> = (props) => {
  const [showMenu, setShowMenu] = useState(false);

  const { title, loading = false } = props;
  return (
    <>
      <View style={styles.header}>
        <View style={styles.appName}>
          <Text style={styles.appNameText}>{title}</Text>
          {loading && <ActivityIndicator size="small" color={COLORS.color_link} style={styles.loading} />}
        </View>
        <View style={styles.appOperate}>
          <Icon name="plus-circle" size={24} color={COLORS.color_text_paragraph} onPress={() => setShowMenu(true)} />
        </View>
      </View>
      <MenuLayer visible={showMenu} onClose={() => setShowMenu(!showMenu)} />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: rpx(15),
    paddingRight: rpx(15),
    backgroundColor: COLORS.color_text_base_inverse,
    height: rpx(48),
    borderBottomColor: COLORS.borderColor,
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
