import { createContext, useContext } from 'react';
import userStore from './user';
import messageStore from './message';

const store = {
  userStore,
  messageStore,
};

const storeContext = createContext(store);

export const useStores = () => useContext(storeContext);

export default store;
