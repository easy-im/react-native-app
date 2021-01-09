import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import md5 from 'md5';
import config from '@/config';
import { ENUM_SOCKET_MESSAGE_TYPE } from '@/types/enum/message';
import { CHAT_MESSAGE, RESPONSE_MESSAGE, SOCKET_RESPONSE } from '@/types/interface/response';
// import Store from '@/store';

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
    const userStr = await AsyncStorage.getItem('CURRENT_USER');
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
        console.log('ws 收到服务器消息：', data);
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
    // Store.dispatch()
  }

  /**
   * 消息确认，确认消息已被接收，并更新消息ID
   * @param message { RESPONSE_MESSAGE } 收到的消息
   */
  public async onConfirmMessage(message: RESPONSE_MESSAGE) {}
}

export default Chat.getInstance();
