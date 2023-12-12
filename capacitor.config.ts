import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.dashboard',
  appName: 'dashboard',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
