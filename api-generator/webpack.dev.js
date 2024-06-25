const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    proxy: [
      {
        context: () => true,
        target: `http://localhost:5000/`,
        changeOrigin: true,
      },
    ],
    historyApiFallback: true,
    port: 3000,
    open: true,
    hot: true,
    static: {
      directory: path.join(__dirname, "public"),
    },
    client: {
      overlay: {
        errors: false,
        runtimeErrors: false,
      },
    },
  },
  output: {
    clean: true,
    publicPath: "/assets/js",
  },
});
