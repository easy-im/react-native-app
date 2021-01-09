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
}

const initialState: MessageState = {
  totalMessage: 0,
  recent: [],
  messageMap: {},
  messages: [],
};

export const UPDATE_UNREAD_MESSAGE_LIST = 'MESSAGE/UPDATE_UNREAD_MESSAGE_LIST';
export const UPDATE_CHAT_UNREAD_NUMBER = 'MESSAGE/UPDATE_CHAT_UNREAD_NUMBER';

export const GetUnreadMessage = () => {
  return async (dispatch: Dispatch) => {
    const res = await request.get('/user/unreadMessage');
    if (res && res.errno === 200) {
      dispatch({ type: UPDATE_UNREAD_MESSAGE_LIST, payload: { list: res.data } });
      return { success: true, errmsg: '' };
    }
    return { success: false, offline: true, errmsg: res?.errmsg || '网络错误' };
  };
};

export default (state = initialState, action: IAction) => {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_UNREAD_MESSAGE_LIST:
      return updateUnreadMessageList(state, payload);
    case UPDATE_CHAT_UNREAD_NUMBER:
      return updateChatUnreadNumber(state, payload);
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
function updateUnreadMessageList(state: MessageState, payload: any) {
  const { list }: { list: MessageRecord[] } = payload;
  const { messages, recent, messageMap } = state;
  let { totalMessage } = state;
  list.forEach((item) => {
    const { hash } = item;
    if (!hash) {
      return;
    }
    messageMap[hash] = item;
    totalMessage += 1;
    const fid = item.is_owner ? item.dist_id : item.user_id;
    const rIndex = recent.findIndex((i) => i.fid === fid);
    let unreadNumber = 1;
    if (rIndex !== -1) {
      unreadNumber = recent[rIndex].unreadNumber + 1;
      recent.splice(rIndex, 1);
    }
    recent.unshift({
      fid,
      last_message: hash,
      unreadNumber,
    });
    const mItem = messages[fid];
    if (!mItem) {
      messages[fid] = [hash];
    } else {
      if (!mItem.find((i) => i === hash)) {
        messages[fid].push(hash);
      }
    }
  });
  return {
    ...state,
    messages,
    recent,
    messageMap,
    totalMessage,
  };
}

function updateChatUnreadNumber(state: MessageState, payload: any) {
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
    recent,
  };
}
