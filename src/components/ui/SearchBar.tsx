import React, { useState } from 'react';
import { View, TextInput, StyleProp, ViewStyle, StyleSheet, GestureResponderEvent, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { rpx } from '@/utils/screen';
import color from '@/components/library/style/theme';

interface Props {
  placeholder?: string;
  theme?: 'light' | 'dark';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  autoFocus?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  onSubmitEditing?: (text: string) => void;
}

const SearchBar: React.FC<Props> = (props) => {
  const [value, setValue] = useState('');
  const { placeholder, style, disabled = false, onPress, autoFocus = false, onSubmitEditing, theme = 'dark' } = props;

  return (
    <View style={style}>
      <Pressable style={[styles.container, theme === 'dark' ? styles.dark : styles.light]} onPress={onPress}>
        <Icon name="search1" size={16} color="#909399" />
        <TextInput
          returnKeyType="search"
          autoCapitalize="none"
          enablesReturnKeyAutomatically={true}
          style={[styles.input]}
          placeholder={placeholder}
          editable={!disabled}
          autoFocus={autoFocus}
          value={value}
          onChangeText={(text) => setValue(text)}
          onSubmitEditing={() => onSubmitEditing && onSubmitEditing(value)}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    height: rpx(34),
    borderRadius: rpx(17),
    paddingLeft: rpx(12),
    paddingRight: rpx(12),
  },
  input: {
    flex: 1,
    padding: 0,
    marginLeft: rpx(6),
    fontSize: rpx(14),
    color: color.color_text_paragraph,
  },
  light: {
    backgroundColor: color.color_text_base_inverse,
  },
  dark: {
    backgroundColor: 'rgb(242, 242, 242)',
  },
});

export default SearchBar;
