interface User {
  is_current?: number;
  id: number;
  token: string;
  avatar: string;
  client_id: string;
  client_type: string;
  mobile: number;
  nickname: string;
  sex: number;
  status: number;
}

type Friend = User & {
  uid: number;
  friend_id: number;
  remark: string;
};
