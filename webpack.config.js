const path = require('path');
const webpack = require('webpack');

const PRODUCTION = process.env.NODE_ENV === 'production';
// const DEVELOPMENT = process.env.NODE_ENV === 'development';

const entry = PRODUCTION ?
[
  path.join(__dirname, 'client', 'js', 'app.js'),
] :
/**
 * HMR (Hot Module Replacement) for development!
 */
[
  './client/js/app.js',
  'webpack/hot/dev-server',
  'webpack-dev-server/client?http://localhost:8080',
];

const plugins = PRODUCTION ?
[
  new webpack.optimize.UglifyJsPlugin(
    {
      sourceMap: true,
      compress: {
        warnings: true,
      },
    }
  ),
] :
[
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
];

/**
 * Use environment variables in the client!
 */
plugins.push(
  new webpack.DefinePlugin(
    {
      PRODUCTION: JSON.stringify(PRODUCTION),
    }
  )
);

/**
 * If it's not production, include sourcemaps.
 */
const devtool = 'source-map';

module.exports = {
  devtool,
  entry,
  plugins,
  resolve: {},
  module: {
    rules: [
      /**
       * Transpile ES6 (ES2015) to ES5 with Babel
       */
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: 'babel-loader',
      // },
      /**
       * For images, use url-loader
       * If an image is below 10kB then include as data,
       * if not, include as file (file-loader)
       */
      {
        test: /\.(png|jpg|gif)$/,
        exclude: [ /node_modules/ ],
        loader: 'url-loader?limit=10000&name=images/[hash:12].[ext]',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'udomo', 'js'),
    publicPath: './udomo/',
    filename: 'bundle.js',
  },
};
