interface User {
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

interface Friend extends User {
  uid: number;
  friend_id: number;
  remark: string;
}
