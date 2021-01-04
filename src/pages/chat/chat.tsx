import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  TextInput,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import color from '@/common/color';

const Chat: React.FC<{}> = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: '小⑦',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userInfo = {
    nickname: '罗强',
    avatar: 'https://im.wangcai.me/kitim_avatar_1.jpg',
  };
  const friendInfo = {
    nickname: '小⑦',
    avatar: 'https://im.wangcai.me/kitim_avatar_2.jpg',
  };
  const list = [
    { id: 1, is_owner: 1, content: '第一行' },
    { id: 2, is_owner: 0, content: '第二行' },
    { id: 3, is_owner: 1, content: '这种人真是醉了' },
    { id: 4, is_owner: 0, content: '你看他在说屁' },
    { id: 5, is_owner: 1, content: '这种人就是在别人面前找存在感，实则心理内心自卑，这种人就是在别人面前找存在感，' },
    { id: 6, is_owner: 1, content: '呵呵呵哒' },
    {
      id: 7,
      is_owner: 0,
      content:
        '这种人就是在别人面前找存在感，实则心理内心自卑，这种人就是在别人面前找存在感，实则心理内心自卑，这种人就是在别人面前找存在感，实则心理内心自卑，这种人就是在别人面前找存在感，实则心理内心自卑',
    },
    { id: 8, is_owner: 1, content: '是啊' },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={40}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <View style={styles.main}>
          <ScrollView style={styles.chatBody}>
            {list.map((item) => {
              const { is_owner } = item;
              return (
                <View style={[styles.chatItem, is_owner ? styles.chatMine : styles.chatFriend]} key={item.id}>
                  <View style={[styles.chatAvatar, is_owner ? styles.chatMineAvatar : false]}>
                    <Image
                      source={{ uri: is_owner ? userInfo.avatar : friendInfo.avatar }}
                      style={styles.chatAvatarImage}
                    />
                  </View>
                  <View style={[styles.chatTextWrap, is_owner ? styles.chatMineTextWrap : false]}>
                    <View>
                      <Text style={styles.chatNameText}>{is_owner ? userInfo.nickname : friendInfo.nickname}</Text>
                    </View>
                    <View style={[styles.chatContent, is_owner ? styles.chatMineContent : false]}>
                      <Text style={[styles.chatContentText, is_owner ? styles.chatMineContentText : false]}>
                        {item.content}
                      </Text>
                      <View style={is_owner ? styles.chatMineBubble : styles.chatBubble} />
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.chatFooter}>
            <TextInput
              style={styles.input}
              enablesReturnKeyAutomatically={true}
              returnKeyType="send"
              autoCapitalize="none"
              placeholder="请输入"
            />
            <View style={styles.chatToolIcons}>
              <Icon name="meh" size={24} color="#333" style={styles.icon} />
              <Icon name="pluscircleo" size={24} color="#333" style={styles.icon} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  chatBody: {
    flex: 1,
  },
  chatItem: {
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 15,
    flexDirection: 'row',
  },
  chatMine: {
    flex: 1,
    position: 'relative',
    flexDirection: 'row-reverse',
    paddingRight: 120,
  },
  chatFriend: {
    flex: 1,
    position: 'relative',
    paddingRight: 120,
  },
  chatAvatar: {
    marginRight: 15,
  },
  chatMineAvatar: {
    marginLeft: 15,
    marginRight: 0,
  },
  chatAvatarImage: {
    width: 42,
    height: 42,
    borderRadius: 4,
  },
  chatTextWrap: {
    alignItems: 'flex-start',
  },
  chatMineTextWrap: {
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  chatNameText: {
    color: color.gray,
    fontSize: 13,
    lineHeight: 24,
  },
  chatContent: {
    position: 'relative',
    lineHeight: 22,
    marginTop: 5,
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: color.white,
    borderRadius: 4,
  },
  chatMineContent: {
    textAlign: 'left',
    backgroundColor: 'rgb(18, 183, 245)',
  },
  chatContentText: {
    color: color.text,
    fontSize: 16,
  },
  chatMineContentText: {
    color: color.white,
  },
  chatBubble: {
    position: 'absolute',
    left: -10,
    top: 13,
    width: 0,
    height: 0,
    borderWidth: 10,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: color.white,
    borderTopColor: color.white,
    overflow: 'hidden',
  },
  chatMineBubble: {
    position: 'absolute',
    top: 13,
    right: -10,
    width: 0,
    height: 0,
    borderWidth: 10,
    borderStyle: 'solid',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'rgb(18, 183, 245)',
    borderTopColor: 'rgb(18, 183, 245)',
    overflow: 'hidden',
  },
  chatFooter: {
    height: 60,
    backgroundColor: color.background,
    borderTopColor: color.borderLightColor,
    borderTopWidth: 1,
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 12,
    paddingRight: 12,
  },
  input: {
    backgroundColor: color.white,
    flex: 1,
    borderRadius: 5,
    padding: 0,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 15,
  },
  chatToolIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
  },
});

export default Chat;
