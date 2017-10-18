const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const precss = require('precss');
const Webpack = require('webpack');

const config = {
  entry: [
    './src/client/index.js',
    './src/client/styles/index.scss',
  ],
  output: {
    path: __dirname + '/public',
    filename: '[name].js?h=[hash]'
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: 'babel-loader',
      include: path.resolve('./src')
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      include: path.resolve('./src')
    }, {
      test: /\.scss$/,
      loader: 'style-loader?singleton!css-loader!postcss-loader!sass-loader'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader?sourceMap'
    }, {
      test: /\.(ico|png|jpg|gif)$/,
      loader: 'url-loader?name=images/img-[hash:6].[ext]'
    }, {
      test: /\.md$/,
      loader: 'html-loader!markdown-loader'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'raw-loader'
    }, {
      test: /\.html$/,
      loader: 'html-loader'
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve('./src/client/index.html'),
      path: path.resolve('./public'),
      filename: 'index.html',
    }),
    new Webpack.EnvironmentPlugin(['NODE_ENV']),
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': (
        process.env.NODE_ENV === 'production' ?
        '"production"' :
        '"development"'
      ),
      'SERVER_URL': JSON.stringify(process.env.SERVER_URL ? process.env.SERVER_URL : ''),
    }),
    new Webpack.LoaderOptionsPlugin({
      debug: true,
      htmlLoader: {
        ignoreCustomFragments: [/\{\{.*}}/],
      },
      postcss: function () {
        return [precss, autoprefixer];
      },
      babel: {
        presets: ['es2015', 'stage-0'],
      },
    }),
  ],
};

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 8080;

  config.devServer = {
    contentBase: __dirname + '/public',
    host: 'localhost',
    port,
    publicPath: '/',
    hot: true,
    historyApiFallback: true
  };

  config.entry.push(
    require.resolve('webpack/hot/dev-server')
  );

  config.plugins.concat(new Webpack.HotModuleReplacementPlugin());

  config.devtool = 'source-map';
}

module.exports = config;
