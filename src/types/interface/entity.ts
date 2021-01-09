import { ENUM_MESSAGE_CONTENT_TYPE, ENUM_MESSAGE_DIST_TYPE } from '../enum/message';

// 与后端一致
export interface Message {
  id?: number;
  hash: string;
  user_id: number;
  dist_id: number;
  dist_type: ENUM_MESSAGE_DIST_TYPE;
  content_type: ENUM_MESSAGE_CONTENT_TYPE;
  content: string;
  create_time: number;
  is_received?: number;
  is_sent?: number;
  status?: number;
}

export interface MessageRecord extends Message {
  is_owner: 0 | 1;
}
