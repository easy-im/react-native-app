import React from 'react';
import {View, TextInput, StyleProp, ViewStyle, StyleSheet} from 'react-native';

interface Props {
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}
const SearchBar: React.FC<Props> = (props) => {
  const {placeholder, style, disabled = false} = props;
  return (
    <View style={[styles.container, disabled && styles.disabled, style]}>
      <TextInput style={styles.input} placeholder={placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  input: {
    width: '100%',
    height: '100%',
    fontSize: 14,
    color: '#444',
  },
});

export default SearchBar;
