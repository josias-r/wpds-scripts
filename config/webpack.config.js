const path = require("path");
const chalk = require("chalk");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const externals = require("./externals");
const config = require("./wpds-scripts.config");

const PUBLIC_PATH = process.env.PUBLIC_PATH;
const LOG_PREFIX = process.env.LOG_PREFIX;

let webpackConfig = {
  mode: process.env.NODE_ENV,
  entry: () => {
    const files = config.entryFiles;
    const filesObj = {};
    for (let i = 0; i < files.length; ++i) {
      const basename = path
        .basename(files[i])
        // remove file extension
        .replace(/\.[^/.]+$/, "")
        // only keep letters
        .replace(/[^a-zA-Z]+/g, "");
      filesObj[basename] = files[i];
    }
    return filesObj;
  },
  devtool: "source-map",
  externals: externals.concat(config.customExternals),
  output: {
    publicPath: `${PUBLIC_PATH}/assets/`,
    path: path.resolve(process.cwd(), "assets"),
    filename: "[name].bundle.js"
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: true
      })
    ]
  },
  plugins: [new MiniCssExtractPlugin({})],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              presets: [require.resolve("@babel/preset-env")]
            }
          },
          require.resolve("eslint-loader")
        ]
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          require.resolve("style-loader"),
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV !== "production"
            }
          },
          {
            loader: require.resolve("css-loader"),
            options: {
              importLoaders: 2,
              sourceMap: true
            }
          },
          {
            loader: require.resolve("postcss-loader"),
            options: {
              sourceMap: true,
              plugins: () => [
                require("postcss-import")(),
                require("postcss-preset-env")(),
                require("cssnano")()
              ]
            }
          },
          require.resolve("sass-loader")
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        exclude: /(node_modules|bower_components)/,
        loader: require.resolve("file-loader"),
        options: {
          name: "[name].[ext]",
          outputPath: "fonts"
        }
      }
    ].concat(config.customRules)
  }
};

if (config.customWebpackConfig) {
  console.log(
    LOG_PREFIX,
    chalk.yellow("Careful, you are overriding the default webpack config!")
  );
  console.log(LOG_PREFIX, chalk.yellow("This can easily break the process!"));
  webpackConfig = { ...webpackConfig, ...config.customWebpackConfig };
}

if (config.verbose) {
  console.log(LOG_PREFIX, "Final webpack config:", webpackConfig);
}

module.exports = webpackConfig;
