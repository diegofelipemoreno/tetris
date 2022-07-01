const path = require('path');
const extract = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            'file-loader?name=[name].[ext]&outputPath=images/' // ,'image-webpack-loader?bypassOnDebug'
          ]
        },
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000,
    compress: true,
    hot: true, // Enable Hot Module Replacement on the server
    stats: 'errors-only',
    historyApiFallback: true
    // open: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new extract({
      filename: '[name].css'
    }),
    new CopyWebpackPlugin(
      [
        {from: 'src/images', to: 'images'},
        {from: 'src/index.html', to: 'index.html'},
      ],
      {ignore: ['README.md', 'LICENSE.md', 'CHANGES.md']}
    ),
    new HtmlWebpackPlugin({
      title: 'My Tetris',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeScriptTypeAttributes: true
      },
      template: './src/index.html',
    }),
  ],
  mode: 'development'
}