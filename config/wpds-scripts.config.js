const path = require("path");
const { merge } = require("lodash");

let customConfig;
try {
  customConfig = require(`${process.cwd()}/wpds-scripts.config.js`);
} catch (err) {
  process.env.DEFAULT_CONFIG = true;
}

// default config
let config = {
  verbose: false,
  port: 8080,
  host: "localhost",
  proxy: "http://localhost:8000",
  publicPath: `/wp-content/themes/${path.basename(process.cwd())}`,
  entryFiles: [`${process.cwd()}/src/javascripts/main.js`],
  customRules: [],
  customExternals: [],
  customWebpackConfig: false,
  customWebpackDevConfig: false
};

// merge custom config
if (customConfig) {
  config = merge(config, customConfig);
}

module.exports = config;
