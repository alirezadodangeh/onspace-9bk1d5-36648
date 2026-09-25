const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const templateDir = path.resolve(__dirname, 'template');
config.resolver.blockList = new RegExp(
  `^${templateDir.replace(/[/\\]/g, '[/\\\\]')}.*`
);

module.exports = config;
