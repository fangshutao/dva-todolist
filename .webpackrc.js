const path = require('path');

module.exports = {
  alias: {
    '@': path.resolve('src'),
  },
  disableCSSModules: true,
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }],
  ],
};
