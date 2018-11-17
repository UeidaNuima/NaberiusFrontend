const tsImportPluginFactory = require('ts-import-plugin');
const { getLoader } = require('react-app-rewired');
const rewireLessWithModule = require('react-app-rewire-less-with-modules');

module.exports = function override(config, env) {
  const tsLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.includes('ts-loader'),
  );

  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [
        tsImportPluginFactory({
          libraryDirectory: 'es',
          libraryName: 'antd',
        }),
      ],
    }),
  };

  config = rewireLessWithModule(config, env, {
    javascriptEnabled: true,
    modifyVars: {
      '@border-color-base': '#e5e6eb',
      '@layout-body-background': '#f5f6fa',
      '@primary-color': '#4c84ff',
      '@table-selected-row-bg': '#f5f6fa',
    },
  });

  return config;
};
