import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  content: string;
  align?: 'center' | 'left' | 'right';
  cancelText?: string;
  cancelColor?: string;
  confirmText?: string;
  confirmColor?: string;
  showCancel?: boolean;

  visible: boolean;
  animationType?: 'fade' | 'none' | 'slide';
  onClose?: () => void;
};

const ModalLayer: React.FC<Props> = (props) => {
  const {
    title,
    content,
    align = 'left',
    cancelText = '取消',
    cancelColor = '#8F8F8F',
    confirmText = '确定',
    confirmColor = '#FFAD15',
    showCancel = true,

    visible,
    animationType = 'fade',
    onClose = () => 1,
  } = props;

  return (
    <Modal statusBarTranslucent transparent visible={visible} animationType={animationType} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.content}>
          <Text style={[styles.contentText, { textAlign: align }]}>{content}</Text>
        </View>
        <View style={styles.operation}>
          {showCancel && <Text style={[styles.cancelText, { color: cancelColor }]}>{cancelText}</Text>}
          <Text style={[styles.confirmText, { color: confirmColor }]}>{confirmText}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  title: {},
  titleText: {},
  content: {},
  contentText: {},
  operation: {},
  cancelText: {},
  confirmText: {},
});

export default ModalLayer;
