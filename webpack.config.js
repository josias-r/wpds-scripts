const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PUBLIC_PATH = process.env.PUBLIC_PATH;
const files = process.env.FILES.split(",");

const filesToObj = files => {
  const rv = {};
  for (let i = 0; i < files.length; ++i) {
    const basename = path.basename(files[i]).replace(/\.[^/.]+$/, "");
    rv[basename] = files[i];
  }
  return rv;
};

const entryPoints = filesToObj(files);

module.exports = {
  mode: process.env.NODE_ENV,
  entry: entryPoints,
  devtool: "source-map",
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
    ]
  }
};
