import { createConfigFromEnv } from '../types/config';

const getAppConfig = () => {
  const config = createConfigFromEnv();
  return config;
};

export default getAppConfig;
