const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PUBLIC_PATH = process.env.PUBLIC_PATH;
const ENTRY = process.env.ENTRY;

module.exports = {
  mode: process.env.NODE_ENV,
  entry: ENTRY,
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
        use: [
          require.resolve("eslint-loader"),
          {
            loader: require.resolve("babel-loader"),
            options: {
              presets: [require.resolve("@babel/preset-env")]
            }
          }
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
    ]
  }
};
