import { Dispatch } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IAction } from '@/types/interface/redux';
import { MessageRecord } from '@/types/interface/entity';
import { MESSAGE_RECENT_KEY, MESSAGE_TOTAL_COUNT_KEY } from '@/storage/storageKeys';
import MessageStorage, { Message } from '@/storage/message';
import { GetUserUnreadMessage, UpdateRemoteMessageStatus } from '@/service';

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

const USER_CHAT_MESSAGE_LIMIT = 50;

export const UPDATE_MESSAGE_LIST = 'MESSAGE/UPDATE_MESSAGE_LIST';
export const RESET_CHAT_UNREAD_NUMBER = 'MESSAGE/RESET_CHAT_UNREAD_NUMBER';
export const UPDATE_MESSAGE_SENDING_STATUS = 'MESSAGE/UPDATE_MESSAGE_SENDING_STATUS';
export const UPDATE_CURRENT_CHAT_USER = 'MESSAGE/UPDATE_CURRENT_CHAT_USER';
export const INIT_STORE = 'MESSAGE/INIT_STORE';
export const RECLAIM_USER_MESSAGE = 'MESSAGE/RECLAIM_USER_MESSAGE';

// 获取用户未读消息
export const GetUnreadMessage = () => {
  return async (dispatch: Dispatch) => {
    const res = await GetUserUnreadMessage();
    if (res && res.errno === 200) {
      const ids: number[] = [];
      const data = res.data.map((item: MessageRecord) => {
        item.is_received = 1;
        item.id && ids.push(item.id);
        return item;
      });
      // 向服务器更新消息已接收状态
      await UpdateRemoteMessageStatus(ids, { is_received: 1 });
      dispatch({ type: UPDATE_MESSAGE_LIST, payload: { list: data, isRead: false } });
      return { success: true, errmsg: '' };
    }
    return { success: false, offline: true, errmsg: res?.errmsg || '网络错误' };
  };
};

// 从本地存储中恢复消息
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
        const data = await MessageStorage.getMessageByFid(fid, USER_CHAT_MESSAGE_LIMIT);
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
    dispatch({ type: INIT_STORE, payload: { recent, totalMessage, messageMap, messages } });
  };
};

export default (state = initialState, action: IAction) => {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_MESSAGE_LIST:
      return updateMessageList(state, payload);
    case RESET_CHAT_UNREAD_NUMBER:
      return resetChatUnreadNumber(state, payload);
    case UPDATE_MESSAGE_SENDING_STATUS:
      return updateMessageSendingStatus(state, payload);
    case RECLAIM_USER_MESSAGE:
      return reclaimUserMessage(state, payload);
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

    // 该消息已存在，属于重复消息，更新但后续处理
    if (messageMap[hash]) {
      messageMap[hash] = item;
      return;
    }
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

/**
 * 更新本地消息已发送状态
 * @param state
 * @param payload
 */
function updateMessageSendingStatus(state: MessageState, payload: any) {
  const { hash, succeeded }: { fid: number; hash: string; succeeded: boolean } = payload;
  const { messageMap } = state;
  if (messageMap[hash] && succeeded) {
    messageMap[hash].is_sent = 1;
  }
  return {
    ...state,
    messageMap: { ...messageMap },
  };
}

/**
 * 用户退出界面时，回收消息列表中超过50条部分，优化性能
 * @param state
 * @param payload
 */
function reclaimUserMessage(state: MessageState, payload: any) {
  const { fid }: { fid: number } = payload;
  const { messageMap, messages } = state;
  const userMessage = messages[fid];
  if (!userMessage || userMessage.length <= USER_CHAT_MESSAGE_LIMIT) {
    return state;
  }
  const deleteItems = userMessage.splice(0, userMessage.length - USER_CHAT_MESSAGE_LIMIT);
  deleteItems.forEach((hash) => {
    delete messageMap[hash];
  });
  return {
    ...state,
    messageMap: { ...messageMap },
    messages: { ...messages },
  };
}