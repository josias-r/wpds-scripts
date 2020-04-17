"use-strict";

process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

process.on("unhandledRejection", (err) => {
  throw err;
});

const webpack = require("webpack");
const config = require("../config/webpack.config");
const chalk = require("chalk");

const LOG_PREFIX = process.env.LOG_PREFIX;

webpack(config, (err, stats) => {
  let status = chalk.green.bold("without any errors or warnings.");
  if (err) {
    console.error(chalk.red(err.stack || err));
    if (err.details) {
      console.error(chalk.red(err.details));
    }
    return;
  }
  const info = stats.toJson();
  if (stats.hasWarnings()) {
    console.warn(chalk.yellow(info.warnings));
    status = chalk.yellow.bold("with warnings.");
  }
  if (stats.hasErrors()) {
    console.error(chalk.red(info.errors));
    status = chalk.red.bold("with errors.");
  }
  console.log(LOG_PREFIX, chalk.green("Wepack build has finished"), status);
});
