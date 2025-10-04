const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp', 'bmp', 'tiff'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
