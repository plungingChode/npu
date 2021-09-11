const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  target: "web",
  output: {
    filename: "npu-dev.user.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: () => {
        const version = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8")).version;
        if (typeof version !== "string" || !/^\d+\.\d+\.\d+$/.exec(version)) {
          throw new Error(`Invalid package version: ${version}`);
        }
        const meta = fs
          .readFileSync(path.join(__dirname, "src", "meta-dev.txt"), "utf8")
          .replace("<version>", version)
          .replace("<dev-build>", path.resolve(__dirname, "dist", "npu-dev.user.js"));
        return meta;
      },
      entryOnly: true,
      raw: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        use: "url-loader",
      },
      {
        test: /\.scss$/i,
        use: ["raw-loader", "extract-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/i,
        use: ["raw-loader", "extract-loader", "css-loader"]
      }
    ],
  },
};
