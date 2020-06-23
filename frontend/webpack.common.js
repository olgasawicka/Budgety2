const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const autoprefixer = require("autoprefixer");
const webpack = require("webpack");

const SRC_DIR = path.join(__dirname, "src");
const DIST_DIR = path.join(__dirname, "dist");

module.exports = {
  entry: {
    main: SRC_DIR + "/js/index.js",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },

      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        exclude: /(\/fonts)/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "/images/",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: SRC_DIR + "/images",
          to: DIST_DIR + "/images",
        },
      ],
    }),
  ],
};
