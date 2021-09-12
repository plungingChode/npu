const fs = require("fs");
const path = require("path");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const cssLoader = { loader: "css-loader", options: { url: false } };

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  target: "web",
  output: {
    filename: "npu.user.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
  },
  plugins: [
    new TerserPlugin({
      terserOptions: {
        format: {
          preamble: (() => {
            const version = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8")).version;
            if (typeof version !== "string" || !/^\d+\.\d+\.\d+$/.exec(version)) {
              throw new Error(`Invalid package version: ${version}`);
            }
            const meta = fs.readFileSync(path.join(__dirname, "src", "meta.txt"), "utf8");
            return meta.replace("<version>", version);
          })(),
        },
      },
    }),
    new CssMinimizerPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: ["raw-loader", "extract-loader", cssLoader, "sass-loader"],
      },
      {
        test: /\.css$/i,
        use: ["raw-loader", "extract-loader", cssLoader],
      },
    ],
  },
};
