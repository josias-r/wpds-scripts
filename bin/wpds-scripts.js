#!/usr/bin/env node
"use-strict";

process.on("unhandledRejection", err => {
  throw err;
});

const path = require("path");
const chalk = require("chalk");

process.env.LOG_PREFIX = `[${chalk.magenta("wpds")}]`;
const LOG_PREFIX = process.env.LOG_PREFIX;

const args = require("minimist")(process.argv.slice(2));
const config = require("../config/wpds-scripts.config");

if (config.verbose) {
  console.log(LOG_PREFIX, "Final configuration:", config);
}
if (process.env.DEFAULT_CONFIG) {
  console.log(LOG_PREFIX, "Loaded default config");
  console.log(
    LOG_PREFIX,
    "If you configured a custom config, make sure it doesn't throw any errors"
  );
} else {
  console.log(LOG_PREFIX, "Loaded custom config");
}

// entry files
let filePaths = args.e || args.entryFiles || config.entryFiles;
if (typeof filePaths === "string") {
  filePaths = [filePaths];
}

// set config
process.env.PORT = parseInt(args.p || args.port, 10) || config.port;
process.env.HOST = args.h || args.host || config.host;
process.env.PROXY = args.P || args.proxy || config.proxy;
process.env.PUBLIC_PATH = args.publicPath || config.publicPath;
process.env.FILES = filePaths.map(p => {
  console.log(
    `${LOG_PREFIX}[${chalk.cyan("loading")}]`,
    p.replace(process.cwd(), "")
  );
  if (!path.isAbsolute(p)) {
    p = path.resolve(process.cwd(), p);
  }
  return p;
});

const script = args._[0];

switch (script) {
  // case "test":
  case "build":
  case "start": {
    require("../scripts/" + script);
    break;
  }
  default:
    console.log(LOG_PREFIX, 'Unknown script "' + script + '".');
    console.log(LOG_PREFIX, "Perhaps you need to update wpds-scripts?");
    break;
}
