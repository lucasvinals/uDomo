const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const port = 8080;
const config = require('./webpack.config');

new WebpackDevServer(
  webpack(config),
  {
    hot: true,
    filename: config.output.filename,
    proxy: {
      '*': 'http://localhost:12078',
    },
    contentBase: './udomo/views/',
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
    },
  }
).listen(port, 'localhost');
