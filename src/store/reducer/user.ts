import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dispatch } from 'redux';
import UserStorage from '@/storage/user';
import { Friend, User } from '@/types/interface/user';
import { IAction } from '@/types/interface/redux';
import { CURRENT_USER_KEY, USER_FRIEND_LIST_KEY } from '@/storage/storageKeys';
import { GetUserInfo, GetUserFriend, UserSign, UserLogout } from '@/service';
import { ResetMessageStore } from './message';

export interface UserState {
  currentUser?: User;
  friendMap: Record<number, Friend>;
  friendList: { key: string; list: number[] }[];
}

const initialState: UserState = {
  currentUser: undefined,
  friendMap: {},
  friendList: [],
};

export const SET_CURRENT_USER = 'USER/SET_CURRENT_USER';
export const SET_FRIEND_MAP = 'USER/SET_FRIEND_MAP';
export const SET_FRIEND_LIST = 'USER/SET_FRIEND_LIST';
export const INIT_USER_STATE = 'USER/INIT_USER_STATE';

export const ResetUserStore = async (dispatch: Dispatch) => {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
  await AsyncStorage.removeItem(USER_FRIEND_LIST_KEY);
  dispatch({ type: INIT_USER_STATE, payload: { currentUser: undefined, friendMap: {}, friendList: [] } });
};

export const RecoverUserInfo = () => {
  return async (dispatch: Dispatch) => {
    let tmp1 = await AsyncStorage.getItem(USER_FRIEND_LIST_KEY);
    let tmp2 = await UserStorage.getAllUser();
    if (tmp1 && tmp2 && tmp2.length) {
      tmp1 = tmp1 ? JSON.parse(tmp1) : null;
      let tmp3: Record<number, Friend> = {};
      tmp2.forEach((i: any) => {
        tmp3[i.fid] = i;
      });
      dispatch({ type: SET_FRIEND_MAP, payload: { friendMap: tmp3 } });
      dispatch({ type: SET_FRIEND_LIST, payload: { friendList: tmp1 } });
    }
  };
};

export const AutoLogin = () => {
  return async (dispatch: Dispatch) => {
    const userStr = await AsyncStorage.getItem(CURRENT_USER_KEY);
    const user: User | null = userStr ? JSON.parse(userStr) : null;
    if (!user) {
      return { success: false, errmsg: '登陆已失效' };
    }

    dispatch({ type: SET_CURRENT_USER, payload: { currentUser: user } });
    const res = await GetUserInfo();

    if (res && res.errno === 200) {
      AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.data));
      dispatch({ type: SET_CURRENT_USER, payload: { currentUser: res.data } });
      return { success: true, errmsg: '' };
    } else if (res?.errno === 401) {
      await ResetUserStore(dispatch);
      await ResetMessageStore(dispatch);
      return { success: false, errmsg: '登陆已失效' };
    }
    return { success: true, errmsg: res?.errmsg || '网络错误' };
  };
};

export const UserLogin = (payload: { mobile: string; password: string }) => {
  return async (dispatch: Dispatch) => {
    const { mobile, password } = payload;
    const res = await UserSign(mobile, password);
    if (res && res.errno === 200) {
      AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.data));
      dispatch({ type: SET_CURRENT_USER, payload: { currentUser: res.data } });
      return { success: true, errmsg: '' };
    }
    return { success: false, errmsg: res?.errmsg || '网络错误' };
  };
};

export const Logout = () => {
  return async (dispatch: Dispatch) => {
    const res = await UserLogout();

    if (res) {
      await ResetUserStore(dispatch);
      await ResetMessageStore(dispatch);
      return { success: true, errmsg: '' };
    }
    return { success: false, errmsg: res?.errmsg || '网络错误' };
  };
};

export const GetUserFriendList = () => {
  return async (dispatch: Dispatch) => {
    const res = await GetUserFriend();

    if (res && res.errno === 200) {
      const { data }: { data: { key: string; list: Friend[] }[] } = res;
      const map: Record<number, Friend> = {};
      const list = data.map((item) => {
        const l = item.list.map((f) => {
          map[f.fid] = f;
          return f.fid;
        });
        return {
          ...item,
          list: l,
        };
      });
      if (list.length) {
        AsyncStorage.setItem(USER_FRIEND_LIST_KEY, JSON.stringify(list));
        UserStorage.saveUserList(Object.values(map));
        dispatch({ type: SET_FRIEND_MAP, payload: { friendMap: map } });
        dispatch({ type: SET_FRIEND_LIST, payload: { friendList: list } });
      }
      return { success: true, errmsg: '' };
    }
    return { success: false, errmsg: res?.errmsg || '网络错误' };
  };
};

export default (state = initialState, action: IAction) => {
  const { type, payload } = action;
  switch (type) {
    default: {
      return { ...state, ...payload };
    }
  }
};
