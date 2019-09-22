"use-strict";

process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

process.on("unhandledRejection", err => {
  throw err;
});

const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const zlib = require("zlib");
const chokidar = require("chokidar");
const chalk = require("chalk");
const config = require("../config/wpds-scripts.config");
const webpackConfig = require("../config/webpack.config");

const LOG_PREFIX = process.env.LOG_PREFIX;
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const PROXY = process.env.PROXY;
const PUBLIC_PATH = process.env.PUBLIC_PATH;

const proxyRes = (proxyRes, req, res) => {
  // catch body data stream
  let body = new Buffer.from("");
  proxyRes.on("data", data => {
    body = Buffer.concat([body, data]);
  });
  proxyRes.on("end", () => {
    // set headers
    const encoding = proxyRes.headers["content-encoding"] || "";
    const type = proxyRes.headers["content-type"] || "";
    delete proxyRes.headers["x-powered-by"];

    // only change for html (ignore images etc.)
    if (type.includes("text/html")) {
      // handle gzip
      const ungzip = new Promise((resolve, reject) => {
        if (encoding === "gzip") {
          zlib.gunzip(body, (err, dezipped) => {
            body = dezipped;
            delete proxyRes.headers["content-encoding"];
            if (err) reject(err);
            resolve();
          });
        } else {
          resolve();
        }
      });
      ungzip
        .then(() => {
          const re = new RegExp(PROXY, "g");
          body = body
            .toString("utf-8")
            // replace all hyperlinks
            .replace(re, `http://${HOST}:${PORT}`);
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          res.end(body);
        })
        .catch(err => {
          res.end(err);
        });
    } else {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      res.end(body);
    }
  });
};

let devServerConfig = {
  // noInfo: true,
  stats: "minimal",
  before: (app, server) => {
    // watch PHP files
    const files = ["**/*.php"];
    chokidar
      .watch(files, {
        alwaysStat: true,
        atomic: false,
        followSymlinks: false,
        ignoreInitial: true,
        ignorePermissionErrors: true
      })
      .on("all", () => {
        server.sockWrite(server.sockets, "content-changed");
      });
  },
  publicPath: `${PUBLIC_PATH}/assets/`,
  hot: true,
  compress: true,
  proxy: {
    "**": {
      selfHandleResponse: true,
      target: PROXY,
      changeOrigin: true,
      onProxyRes: proxyRes
    }
  }
};

if (config.customWebpackConfig) {
  console.log(
    LOG_PREFIX,
    chalk.yellow(
      "Careful, you are overriding the default webpack dev server config!"
    )
  );
  console.log(LOG_PREFIX, chalk.yellow("This can easily break the process!"));
  devServerConfig = { ...devServerConfig, ...config.customWebpackDevConfig };
}

if (config.verbose) {
  console.log(LOG_PREFIX, "Final webpack dev server config:", devServerConfig);
}

const server = new WebpackDevServer(webpack(webpackConfig), devServerConfig);
server.listen(PORT, HOST, function(err) {
  if (err) {
    console.log(LOG_PREFIX, chalk.red(err));
  }

  console.log(
    LOG_PREFIX,
    `Dev server is listening at localhost: ${chalk.cyan(PORT)}`
  );
});
