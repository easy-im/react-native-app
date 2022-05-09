import { SearchUser, UserFriendRequest } from '@/types/user';
import { StackNavigationProp } from '@react-navigation/stack';

export const CURRENT_USER_KEY = '@STORAGE/CURRENT_USER';
export const MAX_CHAT_INPUT_HEIGHT = 85;

export const P_HOME = 'HOME';
export const P_RECENT = 'RECENT';
export const P_ADDRESS_BOOK = 'ADDRESS_BOOK';
export const P_PROFILE = 'PROFILE';
export const P_LOGIN = 'LOGIN';
export const P_REGISTER = 'REGISTER';
export const P_CHAT = 'CHAT';
export const P_SEARCH = 'SEARCH';
export const P_FRIEND_REQUEST = 'FRIEND_REQUEST';
export const P_APPLY_TO_FRIEND = 'APPLY_TO_FRIEND';
export const P_ADD_FRIEND = 'ADD_FRIEND';

export type RootStackParamList = {
  [P_HOME]: undefined;
  [P_RECENT]: undefined;
  [P_ADDRESS_BOOK]: undefined;
  [P_LOGIN]: undefined;
  [P_REGISTER]: undefined;
  [P_CHAT]: { id: number; title: string };
  [P_SEARCH]: undefined;
  [P_FRIEND_REQUEST]: undefined;
  [P_ADD_FRIEND]: { userData: UserFriendRequest };
  [P_APPLY_TO_FRIEND]: { userData: SearchUser };
};
export type ScreenProp = StackNavigationProp<RootStackParamList>;
