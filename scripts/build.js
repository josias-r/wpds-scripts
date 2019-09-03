"use-strict";

process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

process.on("unhandledRejection", err => {
  throw err;
});

const webpack = require("webpack");
const config = require("../webpack.config");
const chalk = require("chalk");

webpack(config, (err, stats) => {
  // Stats Object
  if (err || stats.hasErrors()) {
    throw "Something went wrong";
  }
  console.log(chalk.green("Wepack has finished."));
});
