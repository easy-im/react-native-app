import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, StatusBar, TextInput, Keyboard, KeyboardEvent } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import color from '@/components/library/style/theme';
import { rpx } from '@/utils/screen';
import { useDispatch, useSelector } from 'react-redux';
import {
  MessageState,
  RESET_CHAT_UNREAD_NUMBER,
  UPDATE_CURRENT_CHAT_USER,
  RECLAIM_USER_MESSAGE,
} from '@/store/reducer/message';
import { UserState } from '@/store/reducer/user';
import Chat from '@/socket/chat';
import { User } from '@/types/interface/user';

const ChatPage: React.FC<{}> = () => {
  const $scroll = useRef<ScrollView | null>(null);
  const scrollOffset = useRef<number>(0);
  const keyboardHeight = useRef<number>(0);
  const [messageText, setMessageText] = useState('');
  const [inputHeight, setInputHeight] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const dispatch = useDispatch();
  const statusBarHeight = StatusBar.currentHeight || 0;
  const navigation = useNavigation();
  const route = useRoute();
  const { params = {} }: any = route;
  const { id, title } = params;
  const fid = Number.isNaN(id) ? 0 : +id;

  const friendMap = useSelector((state: { user: UserState }) => state.user.friendMap);
  const currentUser = useSelector((state: { user: UserState }) => state.user.currentUser);
  const messageMap = useSelector((state: { message: MessageState }) => state.message.messageMap);
  const messages = useSelector((state: { message: MessageState }) => state.message.messages);

  const friendInfo = friendMap[fid];
  const list = messages[fid] || [];

  // console.log(list, messageMap, currentUser, friendInfo);

  useEffect(() => {
    title &&
      navigation.setOptions({
        title: title,
      });
    // 重置未读消息
    dispatch({ type: RESET_CHAT_UNREAD_NUMBER, payload: { fid, currentUserId: currentUser?.id } });
    // 设置当前用户为在聊用户
    dispatch({ type: UPDATE_CURRENT_CHAT_USER, payload: { currentChatUserId: fid } });

    Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
    setLoaded(true);

    return () => {
      dispatch({ type: UPDATE_CURRENT_CHAT_USER, payload: { currentChatUserId: 0 } });
      dispatch({ type: RECLAIM_USER_MESSAGE, payload: { fid } });

      Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
      Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 页面滚动到底部
    $scroll.current?.scrollToEnd({ animated: loaded });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length]);

  // 键盘弹出处理
  const handleKeyboardShow = (e: KeyboardEvent) => {
    const { endCoordinates } = e;
    const { height } = endCoordinates;
    keyboardHeight.current = height;
    $scroll.current?.scrollTo({
      y: height + scrollOffset.current + statusBarHeight,
      animated: true,
    });
  };

  // 键盘收起处理
  const handleKeyboardHide = () => {
    $scroll.current?.scrollTo({
      y: scrollOffset.current - keyboardHeight.current - statusBarHeight,
      animated: true,
    });
  };

  const sendMessage = () => {
    const text = messageText.trim();
    if (!text) {
      return false;
    }
    Chat.sendMessage(text, {
      userInfo: currentUser as User,
      friendInfo,
      isGroup: false,
    });
    setMessageText('');
    setInputHeight(0);
  };

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <ScrollView
        ref={$scroll}
        style={styles.chatBody}
        keyboardShouldPersistTaps="always"
        onScroll={(event) => (scrollOffset.current = event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        {list.map((hash, index) => {
          const message = messageMap[hash];
          if (!message) {
            return null;
          }
          const { is_owner } = message;

          return (
            <View
              style={[
                styles.chatItem,
                is_owner ? styles.chatMine : styles.chatFriend,
                index === 0 && styles.chatFirstItem,
              ]}
              key={hash}
            >
              <View style={[styles.chatAvatar, is_owner ? styles.chatMineAvatar : false]}>
                <Image
                  source={{ uri: is_owner ? currentUser?.avatar : friendInfo.avatar }}
                  style={styles.chatAvatarImage}
                />
              </View>
              <View style={[styles.chatTextWrap, is_owner ? styles.chatMineTextWrap : false]}>
                {/* <View>
                    <Text style={styles.chatNameText}>
                      {is_owner ? currentUser?.nickname : friendInfo.remark || friendInfo.nickname}
                    </Text>
                  </View> */}
                <View style={[styles.chatContent, is_owner ? styles.chatMineContent : false]}>
                  <Text
                    selectable={true}
                    style={[styles.chatContentText, is_owner ? styles.chatMineContentText : false]}
                  >
                    {message.content}
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
          onContentSizeChange={(e) => {
            setInputHeight(e.nativeEvent.contentSize.height);
          }}
          onChangeText={(text) => setMessageText(text)}
          value={messageText}
        />
        <View style={styles.chatToolIcons}>
          <Icon name="meh" size={rpx(23)} color={color.color_text_paragraph} style={styles.icon} />
          {!messageText.trim() && (
            <Icon name="pluscircleo" size={rpx(23)} color={color.color_text_paragraph} style={styles.icon} />
          )}
          {!!messageText.trim() && (
            <FeatherIcon
              onPress={sendMessage}
              name="send"
              size={rpx(25)}
              color={color.color_link}
              style={styles.icon}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#efefef',
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
    backgroundColor: color.color_text_base_inverse,
    borderRadius: rpx(4),
  },
  chatMineContent: {
    textAlign: 'left',
    backgroundColor: 'rgb(18, 183, 245)',
  },
  chatContentText: {
    color: color.color_text_paragraph,
    fontSize: rpx(16),
  },
  chatMineContentText: {
    color: color.color_text_base_inverse,
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
    borderRightColor: color.color_text_base_inverse,
    borderTopColor: color.color_text_base_inverse,
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
    backgroundColor: color.color_text_base_inverse,
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

export default ChatPage;
