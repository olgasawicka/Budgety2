const path = require("path");
const common = require("./webpack.common");
const merge = require("webpack-merge");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const config = merge(common, {
  mode: "development",
  output: {
    filename: "js/[name].bundle.js",
    path: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
    }),
  ],
  devtool: "eval-source-map",
  devServer: {
    public: "localhost:8080",
    port: "8080",
    host: "0.0.0.0",
    contentBase: path.join(__dirname, "dist"),
    historyApiFallback: true,
  },
});

module.exports = config;
