const path = require("path");

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PUBLIC_PATH =
  process.env.PUBLIC_PATH ||
  `/wp-content/themes/${path.basename(process.cwd())}`;

console.log(`PUBLIC_PATH is set to >${PUBLIC_PATH}<`);

module.exports = {
  mode: process.env.NODE_ENV,
  entry: `${process.cwd()}/src/javascripts/main.js`,
  devtool: "source-map",
  output: {
    publicPath: `${PUBLIC_PATH}/assets/`,
    path: path.resolve(process.cwd(), "assets"),
    filename: "main.bundle.js"
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
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          "style-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV !== "production"
            }
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "fonts"
        }
      }
    ]
  }
};
