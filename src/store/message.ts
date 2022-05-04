import { action, makeObservable, observable, runInAction } from 'mobx';
import { MessageRecord } from '@/types/entity';
import { GetUserUnreadMessage, UpdateRemoteMessageStatus } from '@/service';
import userStore from './user';

const USER_CHAT_MESSAGE_LIMIT = 50;

class Message {
  @observable totalMessage = 0;
  @observable currentChatUserId = 0;
  @observable recent: { fid: number; last_message: string; unreadNumber: number }[] = [];
  @observable messageMap: Record<string, MessageRecord> = {}; // {hash, [message]}
  @observable messages: Record<number, string[]> = {}; // {fid: [hash]}

  constructor() {
    makeObservable(this);
  }

  // 重置
  @action
  reset() {
    runInAction(() => {
      this.currentChatUserId = 0;
      this.totalMessage = 0;
      this.recent = [];
      this.messageMap = {};
      this.messages = {};
    });
  }

  // 设置当前对话的用户ID
  @action
  setCurrentChatUserId(id: number) {
    runInAction(() => {
      this.currentChatUserId = id;
    });
  }

  // 获取用户未读消息
  @action
  async getUnreadMessage() {
    const { userInfo } = userStore;
    if (!userInfo || !userInfo.id) {
      return;
    }
    const res = await GetUserUnreadMessage();
    if (res && res.errno === 200) {
      runInAction(() => {
        this.updateMessageList(res.data, false);
      });
      return { success: true, errmsg: '' };
    }
    return { success: false, offline: true, errmsg: res?.errmsg || '网络错误' };
  }

  // 处理收到的消息
  @action
  updateMessageList(list: MessageRecord[], isRead: boolean) {
    const { userInfo } = userStore;
    const uid = userInfo?.id;
    if (!uid) {
      return;
    }

    const { messages, recent, messageMap, currentChatUserId } = this;
    let { totalMessage } = this;
    const ids: number[] = [];

    list.forEach((item) => {
      const { hash } = item;
      if (!hash) {
        return;
      }

      const fid = item.is_owner ? item.dist_id : item.user_id;
      const isCurrentChatUser = currentChatUserId === +fid;
      const shouldUpdateUnread = !isRead && !isCurrentChatUser;

      item.is_received = 1;
      item.id && ids.push(item.id);

      // 该消息已存在，属于重复消息，更新该消息但不再进行后续处理
      if (messageMap[hash]) {
        messageMap[hash] = item;
        return;
      }
      if (shouldUpdateUnread) {
        totalMessage += 1;
      }
      messageMap[hash] = item;
      // 处理最近联系人
      const rIndex = recent.findIndex((i) => i.fid === fid);
      let unreadNumber = 0;
      if (rIndex !== -1) {
        unreadNumber = recent[rIndex].unreadNumber;
        recent.splice(rIndex, 1);
      }
      if (shouldUpdateUnread) {
        unreadNumber += 1;
      }
      recent.unshift({
        fid,
        last_message: hash,
        unreadNumber,
      });
      // 处理消息列表
      const mItem = messages[fid];
      if (!mItem || !mItem.length) {
        messages[fid] = [hash];
      } else if (!mItem.find((i) => i === hash)) {
        messages[fid].push(hash);
      }
    });

    // 向服务器更新消息已接收状态
    UpdateRemoteMessageStatus(ids, { is_received: 1 });

    runInAction(() => {
      this.totalMessage = totalMessage;
      this.messages = { ...messages };
      this.messageMap = { ...messageMap };
      this.recent = [...recent];
    });
  }

  // 将某个对话的未读数置为零
  @action
  resetChatUnreadNumber(fid: number) {
    let { totalMessage, recent } = this;
    const index = recent.findIndex((i) => i.fid === fid);
    if (index !== -1) {
      totalMessage -= recent[index].unreadNumber;
      recent[index].unreadNumber = 0;
    }

    runInAction(() => {
      this.totalMessage = totalMessage;
      this.recent = [...recent];
    });
  }

  // 更新本地消息已发送状态
  @action
  updateMessageSendingStatus(hash: string, succeeded: boolean) {
    const { messageMap } = this;
    if (messageMap[hash] && succeeded) {
      messageMap[hash].is_sent = 1;
    }

    runInAction(() => {
      this.messageMap = { ...messageMap };
    });
  }

  // 用户退出界面时，回收消息列表中超过50条部分，优化性能
  @action
  reclaimUserMessage(fid: number) {
    const { messageMap, messages } = this;
    const userMessage = messages[fid];

    if (!userMessage || userMessage.length <= USER_CHAT_MESSAGE_LIMIT) {
      return true;
    }

    const deleteItems = userMessage.splice(0, userMessage.length - USER_CHAT_MESSAGE_LIMIT);
    deleteItems.forEach((hash) => {
      delete messageMap[hash];
    });

    runInAction(() => {
      this.messageMap = { ...messageMap };
      this.messages = { ...messages };
    });
  }
}

const messageStore = new Message();

export default messageStore;
