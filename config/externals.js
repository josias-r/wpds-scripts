const LOG_PREFIX = process.env.LOG_PREFIX;
const config = require("./wpds-scripts.config");

const camelCaseDash = string =>
  string.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());

const externals = [
  (context, request, callback) => {
    const regex = /^@wordpress\//i;
    if (regex.test(request)) {
      const processedReq = camelCaseDash(request.replace(regex, "wp."));
      if (config.verbose) {
        console.log(LOG_PREFIX, "Detected external dependency:", request);
      }
      return callback(null, "root " + processedReq);
    }
    callback();
  },
  {
    wp: "wp",
    lodash: "lodash"
  }
];

module.exports = externals;
