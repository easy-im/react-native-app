import request from '@/utils/request';

export const GetUserInfo = () => request.get('/user/info');
export const UserSign = (mobile: string, password: string) => request.put('/user/signIn', { mobile, password });
export const GetUserFriend = () => request.get('/user/friends');
export const UserLogout = () => request.put('/user/signOut');
export const UserRegister = (mobile: string, password: string) => request.post('/user/signUp', { mobile, password });
export const UserSearch = (mobile: number) => request.post('/user/search', { mobile });
