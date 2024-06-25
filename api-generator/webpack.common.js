const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  entry: {
    app: {
      import: "./src/index.ts",
    },
  },
  resolve: {
    extensions: [".ts", ".js", ".css", ".scss", ".vue"],
    plugins: [new TsconfigPathsPlugin()],
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, "public/assets/js"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
      },
      {
        test: /\.(scss|sass|css)$/i,
        use: ["vue-style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[hash][ext][query]",
        },
      },
    ],
  },
  optimization: {
    runtimeChunk: "single",
  },
  plugins: [
    new VueLoaderPlugin(),
    // new HtmlWebpackPlugin({
    //   title: "Output Management",
    // }),
  ],
};
