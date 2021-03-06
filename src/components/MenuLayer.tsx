import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  StatusBar,
  Pressable,
  NativeModules,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { rpx } from '@/utils/screen';
import COLORS from '@/core/color';
import { P_SEARCH, ScreenProp } from '@/core/constant';

const { StatusBarManager } = NativeModules;
interface Props {
  visible: boolean;
  onClose: () => void;
}

const MenuLayer: React.FC<Props> = (props) => {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const navigation = useNavigation<ScreenProp>();
  const { visible, onClose } = props;

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight((status: { height: number }) => {
        setStatusBarHeight(status.height);
      });
    } else if (Platform.OS === 'android') {
      setStatusBarHeight(StatusBar.currentHeight || 0);
    }
  }, []);

  const searchUser = () => {
    onClose();
    navigation.navigate(P_SEARCH);
  };

  return (
    <Modal statusBarTranslucent transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.layer} onPress={onClose}>
        <View style={[styles.menu, { top: statusBarHeight + rpx(52) }]}>
          <TouchableOpacity style={styles.pressWrap} onPress={onClose}>
            <View style={[styles.menuItem, styles.firstItem]}>
              <Image source={require('@/assets/images/icon/scan.png')} style={styles.image} />
              <Text style={styles.text}>扫一扫</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pressWrap} onPress={onClose}>
            <View style={styles.menuItem}>
              <Image source={require('@/assets/images/tab/chat.png')} style={styles.image} />
              <Text style={styles.text}>发起群聊</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pressWrap} onPress={searchUser}>
            <View style={styles.menuItem}>
              <Image source={require('@/assets/images/icon/add.png')} style={styles.image} />
              <Text style={styles.text}>添加好友</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  menu: {
    position: 'absolute',
    zIndex: 2,
    right: rpx(8),
    backgroundColor: COLORS.color_text_base_inverse,
    borderRadius: rpx(6),
    borderWidth: 0.5,
    borderColor: COLORS.borderLightColor,
    elevation: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rpx(12),
    paddingLeft: 0,
    paddingRight: rpx(40),
    borderTopColor: COLORS.borderColor,
    borderTopWidth: 0.5,
  },
  pressWrap: {
    paddingLeft: rpx(18),
    paddingRight: rpx(18),
  },
  firstItem: {
    borderTopWidth: 0,
  },
  image: {
    width: rpx(24),
    height: rpx(24),
    marginRight: rpx(15),
  },
  text: {
    color: COLORS.color_text_paragraph,
    fontSize: rpx(16),
  },
});

export default MenuLayer;
