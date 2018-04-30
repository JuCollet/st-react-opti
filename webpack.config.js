const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    bundle: './src/index.jsx',
    vendor: ['react', 'react-dom', 'react-router-dom'],
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, './dist'),
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, './dist'),
    host: process.env.IP,
    port: process.env.PORT,
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.(js|jsx)$/,
        exclude: path.resolve(__dirname, './node_modules'),
      }, {
        loader: ExtractTextPlugin.extract({
          loader: 'css-loader!postcss-loader!less-loader',
        }),
        test: /\.less$/,
      }, {
        loader: ExtractTextPlugin.extract({
          loader: 'css-loader',
        }),
        test: /\.css$/,
      }, {
        use: [{
          loader: 'url-loader',
          options: {
            limit: 200000,
            name: './img/[hash].[ext]',
          },
        },
        'image-webpack-loader',
        ],
        test: /\.(png|jpeg|jpg|gif|svg)$/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'styles.[chunkhash].css',
      allChunks: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
    }),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      title: 'Supertime - React optimized dummy app',
      template: 'src/index.ejs',
      files: {
        css: 'styles.[chunkhash].css',
      },
    }),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.UglifyJsPlugin(),
  );
}

module.exports = config;
