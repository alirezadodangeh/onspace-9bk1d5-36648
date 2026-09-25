const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Exclude the template/ folder from Metro's dependency tree
// to prevent version mismatch errors with platform-internal packages
const { exclusionList } = require('metro-config');
config.resolver.blockList = exclusionList([
  new RegExp(`${path.resolve(__dirname, 'template').replace(/\\/g, '\\\\')}.*`),
]);

module.exports = config;
