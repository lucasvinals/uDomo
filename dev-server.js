const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const port = 8080;

new WebpackDevServer(
  webpack(config),
  {
    hot: true,
    filename: config.output.filename,
    publicPath: config.output.publicPath,
    stats: { colors: true },
  }
).listen(port, 'localhost');
