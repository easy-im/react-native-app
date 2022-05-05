import { action, makeObservable, observable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Friend, UserInfo, UserFriendRequest } from '@/types/user';
import { CURRENT_USER_KEY } from '@/core/constant';
import { GetUserFriend, GetUserFriendRequest, GetUserInfo, UserLogout, UserLogin } from '@/service';
import messageStore from './message';
import { FriendInfo } from '@/types/user';

class User {
  @observable userInfo?: UserInfo;
  @observable friendMap: Record<number, Friend> = {};
  @observable friendList: { key: string; list: number[] }[] = [];
  @observable userFriendRequest: UserFriendRequest[] = [];
  @observable userFriendRequestCount = 0;

  constructor() {
    makeObservable(this);
  }

  // 退出清空数据
  @action
  async reset() {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    runInAction(() => {
      this.userInfo = undefined;
      this.friendMap = {};
      this.friendList = [];
      this.userFriendRequest = [];
      this.userFriendRequestCount = 0;
    });
  }

  // 退出清空数据
  @action
  async setUserFriendRequest(userFriendRequest: UserFriendRequest[]) {
    runInAction(() => {
      this.userFriendRequest = userFriendRequest;
    });
  }

  // 退出清空数据
  @action
  async setUserFriendRequestCount(count: number) {
    runInAction(() => {
      this.userFriendRequestCount = count;
    });
  }

  @action
  async autoLogin() {
    const userStr = await AsyncStorage.getItem(CURRENT_USER_KEY);
    const user: UserInfo | null = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      return { success: false, errmsg: '登陆已失效' };
    }

    const res = await GetUserInfo();

    if (res && res.errno === 200) {
      AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.data));
      runInAction(() => {
        this.userInfo = res.data;
      });
      return { success: true, errmsg: '' };
    } else if (res?.errno === 401) {
      await this.reset();
      return { success: false, errmsg: '登陆已失效' };
    }
    return { success: false, errmsg: res?.errmsg || '登录错误' };
  }

  @action
  async login(mobile: string, password: string) {
    const res = await UserLogin(mobile, password);
    if (res && res.errno === 200) {
      AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.data));
      runInAction(() => {
        this.userInfo = res.data;
      });
      return { success: true, errmsg: '' };
    }
    return { success: false, errmsg: res?.errmsg || '网络错误' };
  }

  @action
  async logout() {
    const res = await UserLogout();

    if (res) {
      await this.reset();
      await messageStore.reset();
      return { success: true, errmsg: '' };
    }
    return { success: false, errmsg: res?.errmsg || '网络错误' };
  }

  @action
  async getUserFriendList() {
    const { userInfo } = userStore;
    const uid = userInfo?.id;
    if (!uid) {
      return;
    }

    const res = await GetUserFriend();

    if (res && res.errno === 200) {
      const { data }: { data: { key: string; list: Friend[] }[] } = res;
      const map: Record<number, FriendInfo> = {};

      const list = data.map((item) => {
        const l = item.list.map((f) => {
          map[f.fid] = { uid, ...f };
          return f.fid;
        });
        return {
          ...item,
          list: l,
        };
      });

      if (list.length) {
        runInAction(() => {
          this.friendMap = map;
          this.friendList = list;
        });
      }
      return { success: true, errmsg: '' };
    }
    return { success: false, errmsg: res?.errmsg || '网络错误' };
  }

  // 好友请求
  @action
  async getUserFriendRequest() {
    const res = await GetUserFriendRequest();
    if (res && res.errno === 200) {
      let userFriendRequestCount = 0;
      (res.data || []).forEach((item: any) => {
        if (item.status === 0) {
          userFriendRequestCount += 1;
        }
      });

      runInAction(() => {
        this.userFriendRequestCount = userFriendRequestCount;
        this.userFriendRequest = res.data || [];
      });

      return { success: true, errmsg: '' };
    }
    return { success: false, errmsg: res?.errmsg || '网络错误' };
  }
}

const userStore = new User();

export default userStore;
