const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const postCssPresetEnv = require('postcss-preset-env');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const devMode = process.env.NODE_ENV === 'development';

const pug = {
  test: /\.pug$/,
  use: ['html-loader', 'pug-html-loader']
};

const scss = {
  test: /\.(sa|sc|c)ss$/,
  use: [
    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
    { loader: 'css-loader', options: { importLoaders: 1 } },
    {
      loader: 'postcss-loader',
      options: {
        indent: 'postcss',
        plugins: () => [postCssPresetEnv()]
      }
    },
    'sass-loader'
  ]
};

const js = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: ['babel-loader']
};

const files = {
  test: /\.(jpg|png)$/,
  use: ['file-loader']
};

module.exports = {
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  module: {
    rules: [pug, files, scss, js]
  },
  devtool: devMode ? 'inline-source-map' : false,
  optimization: {
    minimizer: [new UglifyJsPlugin(), new OptimizeCSSAssetsPlugin()]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/pug/index.pug'
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new CleanWebpackPlugin(['dist'])
  ]
};
