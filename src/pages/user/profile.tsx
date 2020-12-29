import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Profile: React.FC<{}> = () => {
  return (
    <View style={styles.main}>
      <Text>Profile!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;
