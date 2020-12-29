import React from 'react';
import { Image } from 'react-native';

const TabIcon: React.FC<any> = ({ route, focused, size }) => {
  const list: Record<string, { iconPath: any; selectedIconPath: any }> = {
    Home: {
      iconPath: require('../../assets/images/tab/chat.png'),
      selectedIconPath: require('../../assets/images/tab/chat-active.png'),
    },
    AddressBook: {
      iconPath: require('../../assets/images/tab/address-book.png'),
      selectedIconPath: require('../../assets/images/tab/address-book-active.png'),
    },
    User: {
      iconPath: require('../../assets/images/tab/user.png'),
      selectedIconPath: require('../../assets/images/tab/user-active.png'),
    },
  };
  const { name } = route;
  const select = list[name];
  if (!select) {
    return null;
  }
  return (
    <Image
      source={focused ? select.selectedIconPath : select.iconPath}
      style={{ width: size * 0.8, height: size * 0.8 }}
    />
  );
};

export default TabIcon;
