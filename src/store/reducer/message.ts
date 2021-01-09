import { Dispatch } from 'redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import request from '@/utils/request';
import { IAction } from '@/types/interface/redux';
import { MessageRecord } from '@/types/interface/entity';

export interface MessageState {
  totalMessage: number;
  recent: { fid: number; last_message: string; unreadNumber: number }[];
  messageMap: Record<string, MessageRecord>;
  messages: Record<number, string[]>;
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
    if (!mItem) {
      messages[fid] = [hash];
    } else if (!mItem.find((i) => i === hash)) {
      messages[fid].push(hash);
    }
  });
  return {
    ...state,
    messages: { ...messages },
    recent: [...recent],
    messageMap: { ...messageMap },
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
