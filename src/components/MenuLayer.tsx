import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Modal, StatusBar, Pressable } from 'react-native';
import color from '@/utils/color';
import { rpx } from '@/utils/screen';
import { Toast } from '@ant-design/react-native';
interface Props {
  visible: boolean;
  onClose: () => void;
}

const MenuLayer: React.FC<Props> = (props) => {
  const { visible, onClose } = props;

  const add = () => {
    Toast.info('添加好友');
    onClose();
  };

  return (
    <Modal statusBarTranslucent visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.layer} onPress={onClose}>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.pressWrap}>
            <View style={[styles.menuItem, styles.firstItem]}>
              <Image source={require('@/assets/images/icon/scan.png')} style={styles.image} />
              <Text style={styles.text}>扫一扫</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pressWrap}>
            <View style={styles.menuItem}>
              <Image source={require('@/assets/images/tab/chat.png')} style={styles.image} />
              <Text style={styles.text}>发起群聊</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pressWrap} onPress={add}>
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
    top: (StatusBar.currentHeight || 0) + rpx(52),
    backgroundColor: color.white,
    borderRadius: rpx(6),
    borderWidth: 0.5,
    borderColor: color.borderLightColor,
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
    borderTopColor: color.borderColor,
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
    color: color.text,
    fontSize: rpx(16),
  },
});

export default MenuLayer;
