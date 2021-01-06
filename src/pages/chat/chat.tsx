import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, StatusBar, TextInput, Keyboard, KeyboardEvent } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import color from '@/common/color';
import { rpx } from '@/utils/screen';

const Chat: React.FC<{}> = () => {
  const $scroll = useRef<ScrollView | null>(null);
  const scrollOffset = useRef<number>(0);
  const keyboardHeight = useRef<number>(0);
  const [messageText, setMessageText] = useState('');
  const [inputHeight, setInputHeight] = useState(0);

  const navigation = useNavigation();
  const route = useRoute();
  const statusBarHeight = StatusBar.currentHeight || 0;

  useEffect(() => {
    const { params = {} }: any = route;
    params.title &&
      navigation.setOptions({
        title: params.title,
      });

    $scroll.current?.scrollToEnd({ animated: false });

    Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyboardShow = (e: KeyboardEvent) => {
    const { endCoordinates } = e;
    const { height } = endCoordinates;
    keyboardHeight.current = height;
    $scroll.current?.scrollTo({
      y: height + scrollOffset.current + statusBarHeight,
      animated: true,
    });
  };

  const handleKeyboardHide = () => {
    $scroll.current?.scrollTo({
      y: scrollOffset.current - keyboardHeight.current - statusBarHeight,
      animated: true,
    });
  };

  const userInfo = {
    nickname: '罗强',
    avatar: 'https://im.wangcai.me/speedy_avatar_1.jpg',
  };
  const friendInfo = {
    nickname: '小⑦',
    avatar: 'https://im.wangcai.me/speedy_avatar_2.jpg',
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
    {
      id: 9,
      is_owner: 0,
      content:
        '这种人就是在别人面前找存在感，实则心理内心自卑，这种人就是在别人面前找存在感，实则心理内心自卑，这种人就是在别人面前找存在感，实则心理内心自卑，这种人就是在别人面前找存在感，实则心理内心自卑',
    },
    {
      id: 10,
      is_owner: 0,
      content:
        '这种人就是在别人面前找存在感，实则心理内心自卑，这种人就是在别人面前找存在感，实则心理内心自卑，这种人就是在别人面前找存在感，实则心理内心自卑，这种人就是在别人面前找存在感，实则心理内心自卑',
    },
    {
      id: 11,
      is_owner: 0,
      content:
        '这种人就是在别人面前找存在感，实则心理内心自卑，这种人就是在别人面前找存在感，实则心理内心自卑，这种人就是在别人面前找存在感，实则心理内心自卑，这种人就是在别人面前找存在感，实则心理内心自卑',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.main}>
        <ScrollView
          ref={$scroll}
          style={styles.chatBody}
          keyboardShouldPersistTaps="always"
          onScroll={(event) => (scrollOffset.current = event.nativeEvent.contentOffset.y)}
        >
          {list.map((item, index) => {
            const { is_owner } = item;
            return (
              <View
                style={[
                  styles.chatItem,
                  is_owner ? styles.chatMine : styles.chatFriend,
                  index === 0 && styles.chatFirstItem,
                ]}
                key={item.id}
              >
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
                    <Text
                      selectable={true}
                      style={[styles.chatContentText, is_owner ? styles.chatMineContentText : false]}
                    >
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
            returnKeyType="send"
            autoCapitalize="none"
            textAlignVertical="top"
            style={[styles.input, { height: Math.max(rpx(42), Math.min(rpx(84.3), inputHeight)) }]}
            maxLength={1000}
            multiline={true}
            blurOnSubmit={false}
            enablesReturnKeyAutomatically={true}
            onSubmitEditing={() => {
              console.log(messageText);
            }}
            onContentSizeChange={(e) => {
              setInputHeight(e.nativeEvent.contentSize.height);
            }}
            onChangeText={(text) => setMessageText(text)}
            value={messageText}
          />
          <View style={styles.chatToolIcons}>
            <Icon name="meh" size={rpx(23)} color={color.text} style={styles.icon} />
            {!messageText.trim() && <Icon name="pluscircleo" size={rpx(23)} color={color.text} style={styles.icon} />}
            {!!messageText.trim() && <FeatherIcon name="send" size={rpx(25)} color={color.blue} style={styles.icon} />}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  main: {
    flex: 1,
    justifyContent: 'space-between',
  },
  chatBody: {
    flex: 1,
  },
  chatItem: {
    paddingLeft: rpx(15),
    paddingRight: rpx(15),
    marginBottom: rpx(15),
    flexDirection: 'row',
  },
  chatFirstItem: {
    marginTop: rpx(15),
  },
  chatMine: {
    flex: 1,
    position: 'relative',
    flexDirection: 'row-reverse',
    paddingRight: rpx(120),
  },
  chatFriend: {
    flex: 1,
    position: 'relative',
    paddingRight: rpx(120),
  },
  chatAvatar: {
    marginRight: rpx(15),
  },
  chatMineAvatar: {
    marginLeft: rpx(15),
    marginRight: 0,
  },
  chatAvatarImage: {
    width: rpx(42),
    height: rpx(42),
    borderRadius: rpx(4),
  },
  chatTextWrap: {
    alignItems: 'flex-start',
  },
  chatMineTextWrap: {
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  chatNameText: {
    color: color.lightGray,
    fontSize: rpx(13),
  },
  chatContent: {
    position: 'relative',
    lineHeight: rpx(22),
    marginTop: rpx(5),
    padding: rpx(8),
    paddingLeft: rpx(15),
    paddingRight: rpx(15),
    backgroundColor: color.white,
    borderRadius: rpx(4),
  },
  chatMineContent: {
    textAlign: 'left',
    backgroundColor: 'rgb(18, 183, 245)',
  },
  chatContentText: {
    color: color.text,
    fontSize: rpx(16),
  },
  chatMineContentText: {
    color: color.white,
  },
  chatBubble: {
    position: 'absolute',
    left: rpx(-10),
    top: rpx(13),
    width: 0,
    height: 0,
    borderWidth: rpx(10),
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: color.white,
    borderTopColor: color.white,
    overflow: 'hidden',
  },
  chatMineBubble: {
    position: 'absolute',
    top: rpx(13),
    right: rpx(-10),
    width: 0,
    height: 0,
    borderWidth: rpx(10),
    borderStyle: 'solid',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'rgb(18, 183, 245)',
    borderTopColor: 'rgb(18, 183, 245)',
    overflow: 'hidden',
  },
  chatFooter: {
    flexDirection: 'row',
    backgroundColor: '#f6f6f6',
    borderTopColor: color.borderColor,
    borderTopWidth: 0.5,
    padding: rpx(10),
    paddingLeft: rpx(12),
    paddingRight: rpx(12),
  },
  input: {
    flex: 1,
    backgroundColor: color.white,
    borderColor: color.borderColor,
    borderWidth: 0.5,
    borderRadius: rpx(5),
    padding: rpx(8),
    paddingTop: rpx(10),
    paddingBottom: rpx(10),
    fontSize: rpx(16),
    lineHeight: rpx(24),
  },
  chatToolIcons: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: rpx(8),
  },
  icon: {
    marginLeft: rpx(10),
  },
});

export default Chat;
