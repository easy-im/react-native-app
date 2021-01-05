import dev from './dev';
import prod from './prod';

type EnvType = 'local' | 'development' | 'production';
const env: EnvType = (process.env.NODE_ENV as EnvType) || 'local';

const configMap = {
  local: {},
  development: dev,
  production: prod,
};

const defaults = {
  baseUrl: 'http://app.speedy-im.com/api',
  ws: {
    host: 'http://app.speedy-im.com',
    namespace: 'chat',
  },
};

const config: any = {
  ...defaults,
  ...(configMap[env] || {}),
};

export default config;
