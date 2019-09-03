#!/usr/bin/env node
"use-strict";

process.on("unhandledRejection", err => {
  throw err;
});

const path = require("path");
const chalk = require("chalk");

const args = require("minimist")(process.argv.slice(2));
const logPrefix = `[${chalk.magenta("wptb")}] `;

process.env.ENTRY = args.e ||
  args.entry || [`${process.cwd()}/src/javascripts/main.js`];
process.env.PORT = parseInt(args.p || args.port, 10) || 8080;
process.env.HOST = args.h || args.host || "localhost";
process.env.PROXY = args.P || args.proxy || "http://localhost:8000";
process.env.PUBLIC_PATH =
  args.publicPath || `/wp-content/themes/${path.basename(process.cwd())}`;

const script = args._[0];

switch (script) {
  case "build":
  case "start":
  case "test": {
    require("../scripts/" + script);
    break;
  }
  default:
    console.log(logPrefix, 'Unknown script "' + script + '".');
    console.log(logPrefix, "Perhaps you need to update wptb-scripts?");
    break;
}
