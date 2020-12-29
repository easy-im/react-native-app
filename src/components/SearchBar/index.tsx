import React from 'react';
import {
  View,
  TextInput,
  StyleProp,
  ViewStyle,
  StyleSheet,
  GestureResponderEvent,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';

interface Props {
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}
const SearchBar: React.FC<Props> = (props) => {
  const { placeholder, style, disabled = false, onPress } = props;
  const color = '#909399';
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styles.container, style]}>
          <Icon name="search1" size={16} color={color} />
          <TextInput
            style={[styles.input, { color }]}
            placeholder={placeholder}
            editable={!disabled}
            enablesReturnKeyAutomatically={true}
            returnKeyType="search"
            autoCapitalize="none"
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'rgb(242, 242, 242)',
  },
  input: {
    flex: 1,
    width: '100%',
    height: '100%',
    fontSize: 13,
    padding: 0,
    marginLeft: 6,
  },
});

export default SearchBar;
