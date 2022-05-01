import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import { appName } from './app.json';
import App from './src/app';

LogBox.ignoreLogs(['Require cycle']);

AppRegistry.registerComponent(appName, () => App);
