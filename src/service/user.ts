import request from '@/utils/request';

export const GetUserInfo = () => request.get('/user/info');
export const UserLogin = (mobile: string, password: string) => request.put('/user/login', { mobile, password });
export const UserLogout = () => request.put('/user/logout');
export const UserRegister = (mobile: string, nickname: string, password: string) =>
  request.post('/user/register', { mobile, password, nickname });
export const GetUserFriend = () => request.get('/user/friends');
export const UserSearch = (mobile: number) => request.post('/user/search', { mobile });
export const RequestToBeFriend = (payload: { fid: number; remark: string; message: string }) =>
  request.post('/user/requestToBeFriend', payload);
export const DealFriendRequest = (id: number, agree: boolean, remark?: string) =>
  request.post('/user/dealFriendRequest', { id, agree, remark });
export const GetUserFriendRequest = () => request.get('/user/friendRequest');
