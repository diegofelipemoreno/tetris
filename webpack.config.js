const path = require('path');
const extract = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
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
          test:/\.(sa|sc|c)ss$/,
          use: [
            {
              loader: extract.loader
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass')
              }
            }
          ]
        }
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
    new extract({
      filename: 'bundle.css'
    }),
    new CopyWebpackPlugin(
      [
        {from: 'src/index.html', to: 'index.html'},
      ],
      {ignore: ['README.md', 'LICENSE.md', 'CHANGES.md']}
    ),
  ],
  mode: 'development'
}