/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  expo: {
    name: 'MyGymHere',
    slug: 'MyGymHere',
    scheme: 'mygymhere',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    androidStatusBar: {
      translucent: true,
      backgroundColor: '#00000000',
      barStyle: 'light-content',
    },
    plugins: [
      'expo-barcode-scanner',
      'expo-web-browser',
      [
        'expo-notifications',
        {
          icon: './assets/icon.png',
        },
      ],
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.mygymhere.app',
    },
    android: {
      package: 'com.mygymhere.app',
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
  },
};
