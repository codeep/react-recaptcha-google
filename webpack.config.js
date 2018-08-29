const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "ReactRecaptchaGoogle",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        exclude: /(node_modules|bower_components|dist)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/env"]
          }
        }
      }
    ]
  },
  externals: {
    react: {
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
      root: "React"
    }
  }
};
