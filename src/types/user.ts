export interface UserInfo {
  id: number;
  nickname: string;
  mobile: number;
  password: string;
  avatar: string;
  sex: number;
  token: string;
  client_id: string;
  client_type: 'android' | 'ios';
  create_time: number;
  status: number;
}

export interface Friend {
  fid: number;
  remark: string;
  nickname: string;
  mobile?: number;
  avatar: string;
  sex: number;
  client_id: string;
  client_type: 'android' | 'ios';
  status: number;
}

export type FriendInfo = Friend & {
  uid: number;
};

export interface SearchUser {
  id: number;
  nickname: string;
  mobile: number;
  avatar: string;
  status: 0 | 1 | 2; // 可以添加，不可添加（好友或者自己），已发送请求
}

export interface UserFriendRequest {
  id: number;
  uid: number;
  nickname: string;
  avatar: string;
  dist_id: number;
  message: string;
  remark: string;
  create_time: number;
  status: 0 | 1 | 2; // 未处理，同意，拒绝
}
