import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dispatch } from 'redux';
import request from '@/utils/request';
import UserStorage from '@/storage/user';
import { Friend, User } from '@/types/interface/user';
import { IAction } from '@/types/interface/redux';

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

export const AutoLogin = () => {
  return async (dispatch: Dispatch) => {
    const userStr = await AsyncStorage.getItem('CURRENT_USER');
    const user: User | null = userStr ? JSON.parse(userStr) : null;
    if (!user) {
      return { success: false, errmsg: '您已退出登录' };
    }

    dispatch({ type: SET_CURRENT_USER, payload: { currentUser: user } });
    const res = await request.get('/user/info');

    if (res && res.errno === 200) {
      AsyncStorage.setItem('CURRENT_USER', JSON.stringify(res.data));
      dispatch({ type: SET_CURRENT_USER, payload: { currentUser: res.data } });
      return { success: true, errmsg: '' };
    }
    return { success: true, errmsg: res?.errmsg || '登陆已失效' };
  };
};

export const UserLogin = (payload: { mobile: string; password: string }) => {
  return async (dispatch: Dispatch) => {
    const { mobile, password } = payload;
    const res = await request.put('/user/signIn', {
      mobile,
      password,
    });
    if (res && res.errno === 200) {
      AsyncStorage.setItem('CURRENT_USER', JSON.stringify(res.data));
      dispatch({ type: SET_CURRENT_USER, payload: { currentUser: res.data } });
      return { success: true, errmsg: '' };
    }
    return { success: false, errmsg: res?.errmsg || '网络错误' };
  };
};

export const GetUserFriendList = () => {
  return async (dispatch: Dispatch) => {
    let tmp1 = await AsyncStorage.getItem('USER_FRIEND_LIST');
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

    const res = await request.get('/user/friends');

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
        AsyncStorage.setItem('USER_FRIEND_LIST', JSON.stringify(list));
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
