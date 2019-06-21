const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@border-color-base': '#e5e6eb',
      '@layout-body-background': '#f5f6fa',
      '@primary-color': '#4c84ff',
      '@table-selected-row-bg': '#f5f6fa',
    },
  }),
);
