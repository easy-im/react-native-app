import dev from './dev';
import prod from './prod';

type EnvType = 'local' | 'development' | 'production';
type Config = {
  appName: string;
  baseUrl: string;
  ws: {
    host: string;
    namespace: string;
  };
  cdnUrl: string;
};

const env: EnvType = (process.env.NODE_ENV as EnvType) || 'local';

const configMap = {
  local: {},
  development: dev,
  production: prod,
};

const defaults = {
  appName: 'KitIM',
  baseUrl: 'http://10.12.115.195:8360/api',
  ws: {
    host: 'http://10.12.115.195:8360',
    namespace: 'chat',
  },
  cdnUrl: 'https://img.qiuzhihu.cn',
};

const config: Config = {
  ...defaults,
  ...(configMap[env] || {}),
};

export default config;
