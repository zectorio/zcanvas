
var path = require('path');

module.exports = {
  entry : "./test/index",
  devtool : "inline-source-map",
  output : {
    path : path.resolve(__dirname, "build"),
    filename : "zcanvas-test.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};
