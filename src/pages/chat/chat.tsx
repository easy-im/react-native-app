import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TextInput,
  Keyboard,
  KeyboardEvent,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { Icon } from 'react-native-ui-view';
import COLORS from '@/core/color';
import { rpx } from '@/utils/screen';
import Chat from '@/socket/chat';
import store from '@/store';
import { PageContainer } from '@/router';
import { MAX_CHAT_INPUT_HEIGHT, MODULES } from '@/core/constant';

const ChatPage: React.FC<{}> = () => {
  const $scroll = useRef<ScrollView | null>(null);
  const scrollOffset = useRef<number>(0);
  const keyboardHeight = useRef<number>(0);

  const [messageText, setMessageText] = useState('');
  const [inputHeight, setInputHeight] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const { userStore, messageStore } = store;
  const navigation = useNavigation();
  const route = useRoute();

  const { params = {} }: any = route;
  const { id, title } = params;
  const fid = Number.isNaN(id) ? 0 : +id;

  const statusBarHeight = StatusBar.currentHeight || 0;

  const { friendMap, userInfo } = userStore;
  const { messageMap, messages } = messageStore;

  const friendInfo = friendMap[fid];
  const list = messages[fid] || [];

  useEffect(() => {
    title &&
      navigation.setOptions({
        title: title,
      });
    const showEvent = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const hideEvent = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    (async () => {
      await messageStore.resetChatUnreadNumber(fid);
      await messageStore.setCurrentChatUserId(fid);
      setLoaded(true);
    })();

    return () => {
      messageStore.setCurrentChatUserId(0);
      messageStore.reclaimUserMessage(fid);

      showEvent.remove();
      hideEvent.remove();
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
    console.log('keyboard show');
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
        keyboardShouldPersistTaps="never"
        keyboardDismissMode="none"
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
                  source={{ uri: is_owner ? userInfo?.avatar : friendInfo.avatar }}
                  style={styles.chatAvatarImage}
                />
              </View>
              <View style={[styles.chatTextWrap, is_owner ? styles.chatMineTextWrap : false]}>
                <View>
                  <Text style={styles.chatNameText}>
                    {is_owner ? userInfo?.nickname : friendInfo.remark || friendInfo.nickname}
                  </Text>
                </View>
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
        <Icon name="voice" size={rpx(30)} color={COLORS.lightText} style={styles.voiceIcon} />
        <TextInput
          style={[styles.input, { height: Math.max(rpx(42), Math.min(rpx(MAX_CHAT_INPUT_HEIGHT), inputHeight)) }]}
          returnKeyType="send"
          autoCapitalize="none"
          textAlignVertical="top"
          value={messageText}
          spellCheck={false}
          enablesReturnKeyAutomatically={true}
          blurOnSubmit={false}
          multiline={true}
          maxLength={500}
          onContentSizeChange={(e) => {
            setInputHeight(e.nativeEvent.contentSize.height);
          }}
          onChangeText={(text) => setMessageText(text)}
        />
        {!messageText.trim() ? (
          <Icon name="plus-circle" size={rpx(30)} color={COLORS.lightText} style={styles.icon} />
        ) : null}
        {messageText.trim() ? (
          <Icon name="send" size={rpx(30)} color={COLORS.color_link} style={styles.icon} onPress={sendMessage} />
        ) : null}
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
    width: '100%',
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
    color: COLORS.lightGray,
    fontSize: rpx(13),
  },
  chatContent: {
    position: 'relative',
    lineHeight: rpx(22),
    marginTop: rpx(5),
    padding: rpx(8),
    paddingLeft: rpx(15),
    paddingRight: rpx(15),
    backgroundColor: COLORS.color_text_base_inverse,
    borderRadius: rpx(4),
  },
  chatMineContent: {
    textAlign: 'left',
    backgroundColor: 'rgb(18, 183, 245)',
  },
  chatContentText: {
    color: COLORS.color_text_paragraph,
    fontSize: rpx(16),
  },
  chatMineContentText: {
    color: COLORS.color_text_base_inverse,
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
    borderRightColor: COLORS.color_text_base_inverse,
    borderTopColor: COLORS.color_text_base_inverse,
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
    alignItems: 'flex-end',
    backgroundColor: '#f6f6f6',
    borderTopColor: COLORS.borderColor,
    borderTopWidth: 0.5,
    padding: rpx(10),
    paddingLeft: rpx(12),
    paddingRight: rpx(12),
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.color_text_base_inverse,
    borderColor: COLORS.borderColor,
    borderWidth: 0.5,
    borderRadius: rpx(5),
    paddingHorizontal: rpx(8),
    ...Platform.select({
      android: {
        fontSize: rpx(16),
        height: rpx(42),
        paddingVertical: rpx(10),
      },
      ios: {
        fontSize: rpx(20),
        paddingBottom: 0,
        paddingTop: rpx(12),
      },
    }),
  },
  voiceIcon: {
    marginRight: rpx(10),
    marginBottom: rpx(6),
  },
  icon: {
    marginLeft: rpx(10),
    marginBottom: rpx(6),
  },
});

PageContainer(MODULES.Chat, observer(ChatPage), {
  title: '对话',
  headerStyle: {
    height: Platform.OS === 'android' ? 44 : undefined, // ios设置会错乱
    backgroundColor: COLORS.fill_base,
  },
});
