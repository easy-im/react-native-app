import request from '@/utils/request';

export const GetUserInfo = () => request.get('/user/info');
export const UserSign = (mobile: string, password: string) => request.put('/user/signIn', { mobile, password });
export const GetUserFriend = () => request.get('/user/friends');
