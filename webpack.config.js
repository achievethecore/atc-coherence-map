var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractPlugin = new ExtractTextPlugin({
  filename: 'bundle.css'
});
var path = require("path");

module.exports = {
  cache: true,
  entry: './app',
  devtool: 'source-map',
  output: {
    filename: 'browser-bundle.js',
    path: path.join(__dirname, "build"), 
    publicPath: 'https://achievethecore.org/coherence-map/',
  },
  devServer: {
    historyApiFallback: {
      index: '/index.html'
    },
    proxy: {
      '/coherence-map': {
        target: 'http://localhost:8080',
        pathRewrite: { '^/coherence-map': '' }
      }
    }
  },
  externals: {
    jquery: '$'
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?optional[]=es7.classProperties'},
      {
        test: /\.css$/,
        loader:[ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.scss$/,                    // made scss
        use: extractPlugin.extract({
            use: ['css-loader', 'sass-loader']
        })
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    extractPlugin
  ]
};

