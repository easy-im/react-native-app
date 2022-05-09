import { io, Socket } from 'socket.io-client';
import md5 from 'md5';
import config from '@/config';
import { MESSAGE_CONTENT_TYPE, CHAT_MESSAGE_TYPE, SOCKET_MESSAGE_TYPE } from '@/core/enum';
import { CHAT_MESSAGE, RESPONSE_MESSAGE, SOCKET_RESPONSE } from '@/types/response';
import { Friend } from '@/types/user';
import { Message, MessageRecord } from '@/types/entity';
import messageStore from '@/store/message';
import userStore from '@/store/user';

const { ws } = config;

class Chat {
  private static instance: Chat;
  private socket!: Socket;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Chat();
    }
    return this.instance;
  }

  public async setup() {
    const { userInfo } = userStore;
    if (!userInfo) {
      return;
    }

    // 初始化完成不需要再次初始化
    if (this.socket) {
      return;
    }

    const socket = io(`${ws.host}/${ws.namespace}`, {
      query: {
        token: userInfo.token,
      },
      transports: ['websocket'],
      timeout: 5000,
    });
    socket.on('connect', () => {
      const { id } = socket;
      console.log('ws 已连接', id);
      socket.on(id, (data: SOCKET_RESPONSE) => {
        console.log('ws 收到服务器消息：', data.message_type, data.message);
        switch (data.message_type) {
          case SOCKET_MESSAGE_TYPE.PRIVATE_CHAT:
            this.onMessage(data.message as CHAT_MESSAGE);
            break;
          case SOCKET_MESSAGE_TYPE.MESSAGE_STATUS_CONFIRM:
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
    if (type === CHAT_MESSAGE_TYPE.PRIVATE) {
      messageStore.updateMessageList(messages, false);
    }
  }

  /**
   * 发送消息
   * @param content {string} 发送内容
   * @param options.userInfo {User} 发送者信息
   * @param options.friendInfo {User} 接收者信息
   * @param options.isGroup {boolean} 是否是群消息
   */
  public async sendMessage(content: string, options: { friendInfo: Friend; isGroup: boolean }) {
    const { userInfo } = userStore;
    content = content.trim();
    if (!this.socket || !content || !userInfo?.id) {
      return;
    }

    const { friendInfo, isGroup } = options;
    const message: Message = {
      hash: md5(`${userInfo.id}_${friendInfo.fid}_${+new Date()}`),
      user_id: userInfo.id,
      dist_id: friendInfo.fid,
      dist_type: isGroup ? CHAT_MESSAGE_TYPE.GROUP : CHAT_MESSAGE_TYPE.PRIVATE,
      content_type: MESSAGE_CONTENT_TYPE.TEXT,
      content,
      create_time: +new Date(),
    };
    const record: MessageRecord = {
      ...message,
      is_owner: 1,
    };
    this.socket.emit('message', { message });

    messageStore.updateMessageList([record], true);
  }

  /**
   * 消息确认，确认消息已被接收，并更新消息ID
   * @param message { RESPONSE_MESSAGE } 收到的消息
   */
  public async onConfirmMessage(message: RESPONSE_MESSAGE) {
    await messageStore.updateMessageSendingStatus(message.data.hash, message.data.succeeded);
  }
}

export default Chat.getInstance();
