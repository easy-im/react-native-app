import { rpx } from '@/utils/screen';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../style';

type Props = {
  title: string;
  content: string;
  align?: 'center' | 'left' | 'right';
  cancelText?: string;
  cancelColor?: string;
  confirmText?: string;
  confirmColor?: string;
  showCancel?: boolean;
  mask?: boolean;

  visible: boolean;
  animationType?: 'fade' | 'none' | 'slide';
  onConfirm?: () => void;
  onClose?: () => void;
};

const ModalLayer: React.FC<Props> = (props) => {
  const {
    title,
    content,
    confirmColor,
    cancelColor,
    align = 'left',
    cancelText = '取消',
    confirmText = '确定',
    showCancel = true,
    mask = true,

    visible,
    animationType = 'fade',
    onClose = () => 1,
    onConfirm = () => 1,
  } = props;

  return (
    <Modal statusBarTranslucent transparent visible={visible} animationType={animationType} onRequestClose={onClose}>
      <Pressable style={[styles.container, mask ? styles.mask : undefined]} onPress={onClose}>
        <View style={styles.main}>
          <View style={styles.title}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
          <View style={styles.content}>
            <Text style={[styles.contentText, { textAlign: align }]}>{content}</Text>
          </View>
          <View style={styles.operation}>
            {showCancel && (
              <Text
                style={[styles.button, styles.cancelText, cancelColor ? { color: cancelColor } : undefined]}
                onPress={onClose}
              >
                {cancelText}
              </Text>
            )}
            <Text
              style={[
                styles.button,
                styles.confirmText,
                showCancel && styles.buttonBorder,
                confirmColor ? { color: confirmColor } : undefined,
              ]}
              onPress={onConfirm}
            >
              {confirmText}
            </Text>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: theme.modal_zindex,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mask: {
    backgroundColor: theme.fill_mask,
  },
  main: {
    width: '80%',
    backgroundColor: theme.fill_base,
    borderRadius: theme.radius_md,
  },
  title: {
    marginTop: rpx(theme.v_spacing_lg),
  },
  titleText: {
    textAlign: 'center',
    color: theme.color_text_base,
    fontSize: rpx(theme.modal_font_size_heading),
  },
  content: {
    padding: rpx(theme.h_spacing_lg),
  },
  contentText: {
    fontSize: rpx(theme.font_size_base),
    color: theme.color_text_paragraph,
  },
  operation: {
    display: 'flex',
    flexDirection: 'row',
    borderTopColor: theme.border_color_base,
    borderTopWidth: theme.border_width_sm,
  },
  button: {
    flex: 1,
    fontSize: rpx(theme.modal_button_font_size),
    height: rpx(theme.modal_button_height),
    lineHeight: rpx(theme.modal_button_height),
    textAlign: 'center',
  },
  buttonBorder: {
    borderLeftColor: theme.border_color_base,
    borderLeftWidth: theme.border_width_sm,
  },
  cancelText: {
    color: theme.color_text_secondary,
  },
  confirmText: {
    color: theme.color_link,
  },
});

export default ModalLayer;
