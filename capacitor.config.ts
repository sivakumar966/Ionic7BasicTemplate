import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.dashboard',
  appName: 'dashboard',
  webDir: 'www\browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
