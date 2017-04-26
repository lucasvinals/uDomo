const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEVELOPMENT = process.env.NODE_ENV === 'development';

const entry = PRODUCTION ?
[
  './client/js/app.js',
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
  new ExtractTextPlugin('style-[contenthash:10].css'),
  new HTMLWebpackPlugin(
    {
      template: './client/views/indexProduction.html',
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
      DEVELOPMENT: JSON.stringify(DEVELOPMENT),
    }
  )
);

module.exports = {
  devtool: 'source-map',
  entry,
  plugins,
  resolve: {},
  module: {
    rules: [
      /**
       * Transpile ES6 (ES2015) to ES5 with Babel
       */
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'es2015',
                {
                  modules: false,
                },
              ],
            ],
          },
        },
        exclude: /node_modules/,
      },
      /**
       * For images, use url-loader
       * If an image is below 10kB then include as data,
       * if not, include as file (file-loader)
       */
      {
        test: /\.(png|jpg|gif)$/,
        use: 'url-loader?limit=10000&name=images/[hash:12].[ext]',
        exclude: /node_modules/,
      },
      /**
       * CSS styles
       */
      {
        test: /\.css$/,
        use: PRODUCTION ?
          ExtractTextPlugin.extract(
            {
              use: 'css-loader?minimize&localIdentName=[hash:base64:10]',
            }
          ) :
          /**
           * For development use style-loader
           */
          [ 'style-loader', 'css-loader?localIdentName=[path][name]---[local]' ],
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: path.join(__dirname, 'udomo'),
    publicPath: PRODUCTION ? '/' : '/udomo/',
    filename: PRODUCTION ? 'bundle.[hash:12].min.js' : 'bundle.js',
  },
};
