
var path = require('path');

module.exports = {
  entry : "./index",
  output : {
    path : path.resolve(__dirname, "build"),
    filename : "zcanvas.js"
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
