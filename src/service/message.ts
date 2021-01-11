import request from '@/utils/request';

export const GetUserUnreadMessage = () => request.get('/user/unreadMessage');
export const UpdateRemoteMessageStatus = (ids: number[], columns: { is_received?: 0 | 1; is_read?: 0 | 1 }) =>
  request.put('/message/status', { ids, columns });
