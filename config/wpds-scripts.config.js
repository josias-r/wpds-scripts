const path = require("path");

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
  entryFiles: [`${process.cwd()}/src/javascripts/main.js`]
};

// merge custom config
if (customConfig) {
  config = { ...config, ...customConfig };
}

module.exports = config;
