'use strict';

import webpack from 'webpack';
import path from 'path';
import autoprefixer from 'autoprefixer';
import nested from 'postcss-nested';
import importCSS from 'postcss-import';

const config = {

  context: path.join(__dirname, 'src'),

  entry: [
    'webpack/hot/only-dev-server',
    './index.html',
    './landing.html',
    './app.js',
    './login.html'
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {test: /\.html$/, loader: 'file?name=[name].[ext]'},
      {test: /\.js?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/},
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
      {test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader'},
      {test: /\.(png|gif)$/, loader: 'url-loader?prefix=img/&limit=5000'}
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  postcss: () => [importCSS, nested, autoprefixer]

};

export default config;
