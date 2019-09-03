"use-strict";

process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

process.on("unhandledRejection", err => {
  throw err;
});

const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const zlib = require("zlib");
const path = require("path");
const chokidar = require("chokidar");
const chalk = require("chalk");
const config = require("../webpack.config");

const PORT = parseInt(process.env.PORT, 10) || 8082;
const HOST = process.env.HOST || "0.0.0.0";
const PROXY = process.env.PROXY || "http://localhost:8000";
const PUBLIC_PATH =
  process.env.PUBLIC_PATH ||
  `/wp-content/themes/${path.basename(process.cwd())}`;

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

const server = new WebpackDevServer(webpack(config), {
  // noInfo: true,
  before: (app, server) => {
    // watch PHP files
    const files = [`${process.cwd()}/**/*.php`];
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
  // contentBase: path.resolve(process.cwd(), "src"),
  hot: true,
  compress: true,
  proxy: {
    "**": {
      selfHandleResponse: true,
      target: PUBLIC_PATH,
      changeOrigin: true,
      onProxyRes: proxyRes
    }
  }
});
server.listen(PORT, HOST, function(err) {
  if (err) {
    console.log(chalk.red(err));
  }

  console.log(`Dev server is listening at localhost: ${chalk.cyan(PORT)}`);
});
