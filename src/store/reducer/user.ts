import request from '@/utils/request';
import UserStorage from '@/storage/user';
import { Dispatch } from 'redux';

const initialState = {
  currentUser: undefined,
};

export const SET_CURRENT_USER = 'USER/SET_CURRENT_USER';
export const UserLogin = (payload: { mobile: string; password: string }) => {
  return async (dispatch: Dispatch) => {
    const { mobile, password } = payload;
    const res = await request.put('/user/signIn', {
      mobile,
      password,
    });
    if (res && res.errno === 200) {
      UserStorage.saveUser({
        is_current: 1,
        ...res.data,
      });
      dispatch({ type: SET_CURRENT_USER, payload: { currentUser: res.data } });
      return { success: true, errmsg: '' };
    }
    return { success: false, errmsg: res.errmsg || '网络错误' };
  };
};

export const GetUserFriendList = () => {
  return async (dispatch: Dispatch) => {
    const res = await request.get('/user/friends');
    console.log(res);
    if (res && res.errno === 200) {
      // dispatch({ type: SET_CURRENT_USER, payload: { currentUser: res.data } });
      return { success: true, errmsg: '' };
    }
    return { success: false, errmsg: res.errmsg || '网络错误' };
  };
};

export default (state = initialState, action: IAction) => {
  const { type, payload } = action;
  switch (type) {
    case SET_CURRENT_USER: {
      return {
        ...state,
        currentUser: payload.currentUser,
      };
    }

    default: {
      return { ...state };
    }
  }
};
