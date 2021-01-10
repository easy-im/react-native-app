import { Dispatch } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import request from '@/utils/request';
import { IAction } from '@/types/interface/redux';
import { MessageRecord } from '@/types/interface/entity';
import { MESSAGE_RECENT_KEY, MESSAGE_TOTAL_COUNT_KEY } from '@/storage/storageKeys';
import MessageStorage, { Message } from '@/storage/message';

export interface MessageState {
  totalMessage: number;
  recent: { fid: number; last_message: string; unreadNumber: number }[];
  messageMap: Record<string, MessageRecord>; // {hash, [message]}
  messages: Record<number, string[]>; // {fid: [hash]}
  currentChatUserId: number;
}

const initialState: MessageState = {
  currentChatUserId: 0,
  totalMessage: 0,
  recent: [],
  messageMap: {},
  messages: {},
};

export const UPDATE_MESSAGE_LIST = 'MESSAGE/UPDATE_MESSAGE_LIST';
export const RESET_CHAT_UNREAD_NUMBER = 'MESSAGE/RESET_CHAT_UNREAD_NUMBER';
export const UPDATE_MESSAGE_STATUS = 'MESSAGE/UPDATE_MESSAGE_STATUS';
export const UPDATE_CURRENT_CHAT_USER = 'MESSAGE/UPDATE_CURRENT_CHAT_USER';
export const UPDATE_STORE = 'MESSAGE/UPDATE_STORE';

export const GetUnreadMessage = () => {
  return async (dispatch: Dispatch) => {
    const res = await request.get('/user/unreadMessage');
    if (res && res.errno === 200) {
      dispatch({ type: UPDATE_MESSAGE_LIST, payload: { list: res.data, isRead: false } });
      return { success: true, errmsg: '' };
    }
    return { success: false, offline: true, errmsg: res?.errmsg || '网络错误' };
  };
};

export const RecoverMessageOnInit = () => {
  return async (dispatch: Dispatch) => {
    const recentStr = await AsyncStorage.getItem(MESSAGE_RECENT_KEY);
    const recent: MessageState['recent'] = recentStr ? JSON.parse(recentStr) : [];
    let totalMessage = 0;
    const messageMap: MessageState['messageMap'] = {};
    const messages: MessageState['messages'] = {};

    const pro = recent.map((item) => {
      return (async () => {
        const { fid, unreadNumber } = item;
        totalMessage += unreadNumber || 0;
        const data = await MessageStorage.getMessageByFid(fid);
        if (data && data.length) {
          messages[fid] = data.map((m) => {
            const temp: MessageRecord = {
              hash: m.hash,
              user_id: m.user_id,
              dist_id: m.dist_id,
              dist_type: m.dist_type,
              content_type: m.content_type,
              content: m.content,
              is_received: m.is_received,
              is_sent: m.is_sent,
              create_time: m.create_time,
              status: m.status,
              is_owner: m.is_owner,
            };
            messageMap[temp.hash] = temp;
            return temp.hash;
          });
        }
      })();
    });
    await Promise.all(pro);
    dispatch({ type: UPDATE_STORE, payload: { recent, totalMessage, messageMap, messages } });
  };
};

export default (state = initialState, action: IAction) => {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_MESSAGE_LIST:
      return updateMessageList(state, payload);
    case RESET_CHAT_UNREAD_NUMBER:
      return resetChatUnreadNumber(state, payload);
    case UPDATE_MESSAGE_STATUS:
      return updateMessageStatus(state, payload);
    default: {
      return { ...state, ...payload };
    }
  }
};

/**
 * 处理未读消息
 * @param state
 * @param payload
 */
function updateMessageList(state: MessageState, payload: any) {
  const { list, isRead = false }: { list: MessageRecord[]; isRead: boolean } = payload;
  const { messages, recent, messageMap, currentChatUserId } = state;
  let { totalMessage } = state;
  list.forEach((item) => {
    const { hash } = item;
    if (!hash) {
      return;
    }

    const fid = item.is_owner ? item.dist_id : item.user_id;
    const isCurrentChatUser = currentChatUserId === +fid;
    const shouldUpdateUnread = !isRead && !isCurrentChatUser;

    if (shouldUpdateUnread) {
      totalMessage += 1;
    }
    messageMap[hash] = item;
    // 处理最近联系人
    const rIndex = recent.findIndex((i) => i.fid === fid);
    let unreadNumber = 0;
    if (rIndex !== -1) {
      unreadNumber = recent[rIndex].unreadNumber;
      recent.splice(rIndex, 1);
    }
    if (shouldUpdateUnread) {
      unreadNumber += 1;
    }
    recent.unshift({
      fid,
      last_message: hash,
      unreadNumber,
    });
    // 处理消息列表
    const mItem = messages[fid];
    if (!mItem || !mItem.length) {
      messages[fid] = [hash];
    } else if (!mItem.find((i) => i === hash)) {
      messages[fid].push(hash);
    }

    // 存储消息到数据库
    const m: Message = { ...item, fid };
    delete m.id;
    // console.log(111, m);
    MessageStorage.saveMessage(m, true);
  });
  AsyncStorage.setItem(MESSAGE_RECENT_KEY, JSON.stringify(recent));
  AsyncStorage.setItem(MESSAGE_TOTAL_COUNT_KEY, JSON.stringify(totalMessage));
  return {
    ...state,
    messages: { ...messages },
    messageMap: { ...messageMap },
    recent: [...recent],
    totalMessage,
  };
}

/**
 * 将某个对话的未读数置为零
 * @param state
 * @param payload
 */
function resetChatUnreadNumber(state: MessageState, payload: any) {
  const { fid }: { fid: number } = payload;
  let { totalMessage, recent } = state;
  const index = recent.findIndex((i) => i.fid === fid);
  if (index !== -1) {
    totalMessage -= recent[index].unreadNumber;
    recent[index].unreadNumber = 0;
  }
  return {
    ...state,
    totalMessage,
    recent: [...recent],
  };
}

function updateMessageStatus(state: MessageState, payload: any) {
  const { hash, received }: { fid: number; hash: string; received: boolean } = payload;
  const { messageMap } = state;
  if (messageMap[hash] && received) {
    messageMap[hash].is_sent = 1;
  }
  return {
    ...state,
    messageMap: { ...messageMap },
  };
}
