const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('cjs');

// Use the React Native build of @firebase/auth (includes getReactNativePersistence)
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
