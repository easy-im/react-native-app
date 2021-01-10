import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import md5 from 'md5';
import config from '@/config';
import { ENUM_MESSAGE_CONTENT_TYPE, ENUM_MESSAGE_DIST_TYPE, ENUM_SOCKET_MESSAGE_TYPE } from '@/types/enum/message';
import { CHAT_MESSAGE, RESPONSE_MESSAGE, SOCKET_RESPONSE } from '@/types/interface/response';
import { Friend, User } from '@/types/interface/user';
import { Message, MessageRecord } from '@/types/interface/entity';
import Store from '@/store';
import { UPDATE_MESSAGE_STATUS, UPDATE_MESSAGE_LIST } from '@/store/reducer/message';
import { CURRENT_USER_KEY } from '@/storage/storageKeys';

const { ws } = config;

class Chat {
  private static instance: Chat;
  private token: string = '';
  private socket!: Socket;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Chat();
    }
    return this.instance;
  }

  public async setup() {
    const userStr = await AsyncStorage.getItem(CURRENT_USER_KEY);
    const user = userStr ? JSON.parse(userStr) : null;
    this.token = user ? user.token : null;
    if (!this.token) {
      return;
    }
    const socket = io(`${ws.host}/${ws.namespace}`, {
      query: {
        token: this.token,
      },
      transports: ['websocket'],
      timeout: 5000,
    });
    socket.on('connect', () => {
      const { id } = socket;
      console.log('ws 已连接', id);
      socket.on(id, (data: SOCKET_RESPONSE) => {
        // console.log('ws 收到服务器消息：', data);
        switch (data.message_type) {
          case ENUM_SOCKET_MESSAGE_TYPE.PRIVATE_CHAT:
            this.onMessage(data.message as CHAT_MESSAGE);
            break;
          case ENUM_SOCKET_MESSAGE_TYPE.MESSAGE_STATUS_CONFIRM:
            this.onConfirmMessage(data.message as RESPONSE_MESSAGE);
            break;
        }
      });
    });
    socket.on('connect_error', (msg: any) => {
      console.log('ws error', msg);
    });

    this.socket = socket;
  }

  /**
   * 接收到好友发来消息
   * @param data { CHAT_MESSAGE } 接收到的好友消息
   */
  public async onMessage(data: CHAT_MESSAGE) {
    const { type, messages } = data;
    if (type === ENUM_MESSAGE_DIST_TYPE.PRIVATE) {
      Store.dispatch({ type: UPDATE_MESSAGE_LIST, payload: { list: messages } });
    }
  }

  /**
   * 消息确认，确认消息已被接收，并更新消息ID
   * @param message { RESPONSE_MESSAGE } 收到的消息
   */
  public async onConfirmMessage(message: RESPONSE_MESSAGE) {
    Store.dispatch({ type: UPDATE_MESSAGE_STATUS, payload: message });
  }

  /**
   * 发送消息
   * @param content {string} 发送内容
   * @param options.userInfo {User} 发送者信息
   * @param options.friendInfo {User} 接收者信息
   * @param options.is_group {boolean} 是否是群消息
   */
  public async sendMessage(content: string, options: { userInfo: User; friendInfo: Friend; isGroup: boolean }) {
    if (!this.socket) {
      return;
    }
    content = content.trim();
    if (!content) {
      return;
    }

    const { userInfo, friendInfo, isGroup } = options;
    const message: Message = {
      hash: md5(`${userInfo.id}_${friendInfo.fid}_${+new Date()}`),
      user_id: userInfo.id,
      dist_id: friendInfo.fid,
      dist_type: isGroup ? ENUM_MESSAGE_DIST_TYPE.GROUP : ENUM_MESSAGE_DIST_TYPE.PRIVATE,
      content_type: ENUM_MESSAGE_CONTENT_TYPE.TEXT,
      content,
      create_time: +new Date(),
    };
    const record: MessageRecord = {
      ...message,
      is_owner: 1,
    };
    this.socket.emit('message', { message });
    await Store.dispatch({ type: UPDATE_MESSAGE_LIST, payload: { list: [record], isRead: true } });
  }
}

export default Chat.getInstance();
