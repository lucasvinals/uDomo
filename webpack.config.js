const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { clusterPort } = require('./server/config/environment');
const { argv } = require('optimist');
const PORT = Number(argv.p) || clusterPort;
const PRODUCTION = process.env.NODE_ENV === 'production';
const DEVELOPMENT = process.env.NODE_ENV === 'development';

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
      filename: './views/index.html',
      minify: {
        minifyURLs: 'String',
        removeComments: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeTagWhitespace: true,
        useShortDoctype: true,
        removeAttributeQuotes: true,
        minifyJS: true,
        minifyCSS: true,
        caseSensitive: true,
        collapseWhitespace: true,
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
plugins.push(new webpack.DefinePlugin({ DEVELOPMENT, PRODUCTION, PORT }));

module.exports = {
  devtool: 'source-map',
  entry: './client/js/app.js',
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
            plugins: [ 'transform-decorators-legacy' ],
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
        include: /node_modules\/bootstrap/,
      },
      /**
       * Fonts
       */
      {
        test: /\.(woff2?|woff|ttf|eot|svg)$/,
        loader: 'url-loader?limit=10000&name=fonts/[name].[ext]',
      },
      DEVELOPMENT ?
      {
        test: /\.(html)$/,
        loader: 'raw-loader',
      } : {},
    ],
  },
  output: {
    path: path.join(__dirname, 'udomo'),
    publicPath: '/',
    filename: PRODUCTION ? 'bundle.[hash:12].min.js' : 'bundle.js',
  },
  devServer: {
    contentBase: './client',
    /**
     * This loads HMR on webpack.
     */
    hot: true,
    /**
     * Limit console messages to errors-only.
     */
    stats: 'errors-only',
    /**
     * Open a new browser tab when initialized
     */
    open: true,
    /**
     * Gzip content
     */
    compress: true,
    /**
     * Redirect all uDomo '/api' calls...
     */
    proxy: {
      '/api': {
        target: {
          host: '0.0.0.0',
          port: PORT,
        },
        secure: false,
      },
    },
  },
};
