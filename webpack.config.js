// webpack.config.js
// @see: https://rossta.net/blog/using-webpack-with-middleman.html
var webpack           = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');
    Clean             = require('clean-webpack-plugin'),
    path              = require('path'),
    definePlugin      = new webpack.DefinePlugin({
                          __DEVELOPMENT__: JSON.stringify(JSON.parse(process.env.WEBPACK_ENV === 'development')),
                          __DEBUG__:       JSON.stringify(JSON.parse(process.env.WEBPACK_ENV === 'debug')),
                          __BUILD__:       JSON.stringify(JSON.parse(process.env.WEBPACK_ENV === 'build')),
                          __VERSION__:     (new Date().getTime().toString()) }),
    styleVariables    = 'data/style.yml'

console.log('styleVariables', styleVariables)

module.exports = {
  entry: {
    index: [
      './source/assets/stylesheets/index.scss',
      './source/assets/javascripts/index.js' ],
    head: './source/assets/javascripts/head.js' },

  resolve: {
    root: path.join(__dirname, '/source/assets') },

  output: {
    path: path.join(__dirname, '/.tmp/dist'),
    filename: 'assets/javascripts/[name].bundle.js' },

  module: {
    loaders: [
      { test: /source\/assets\/javascripts\/.*\.js$/,
        exclude: /node_modules|\.tmp|vendor/,
        loader: 'babel-loader',
        query: {
          // cacheDirectory: true,
          // presets: ['es2015', 'stage-0', 'babel-preset-react', 'react']
          presets: ['es2015', 'stage-0'] } },
      { test: require.resolve('jquery'), 
        loader: 'expose?$' },
      { test: require.resolve('lodash'), 
        loader: 'expose?_' },
      { test: require.resolve('mathjs'), 
        loader: 'expose?math' },
      { test: require.resolve('d3'), 
        loader: 'expose?d3' },
      
      // { test: /[\\\/]vendor[\\\/]modernizr\.js$/,
      //   loader: 'imports?this=>window!exports?window.Modernizr' },

      // Load SCSS
      { test: /\.scss$/, 
        // loader: ExtractTextPlugin.extract('style', 'css!ymltosass?path=' + styleVariables + '!sass?includePaths[]=' + (path.resolve(__dirname, './node_modules')))
        loader: ExtractTextPlugin.extract('style', 'css' + '!sass?includePaths[]=' + (path.resolve(__dirname, './node_modules') + '!ymltosass?path=' + styleVariables ))

        // loader: "style!css!sass!ymltosass?path="+ styleVariables,
        // loaders: [
                  // "style!css!sass!ymltosass?path="+ styleVariables,
                  // ExtractTextPlugin.extract('style', 'css!sass?includePaths[]=' + (path.resolve(__dirname, './node_modules')))
                  // ] 
      },

      // Font Definitions
      { test: /\.svg$/,     loader: 'url?limit=65000&mimetype=image/svg+xml&name=assets/fonts/[name].[ext]' },
      { test: /\.woff$/,    loader: 'url?limit=65000&mimetype=application/font-woff&name=assets/fonts/[name].[ext]' },
      { test: /\.woff2$/,   loader: 'url?limit=65000&mimetype=application/font-woff2&name=assets/fonts/[name].[ext]' },
      { test: /\.[ot]tf$/,  loader: 'url?limit=65000&mimetype=application/octet-stream&name=assets/fonts/[name].[ext]' },
      { test: /\.eot$/,     loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=assets/fonts/[name].[ext]' }]},

  node: {
    console: true
  },

  plugins: [
    definePlugin,
    new Clean(['.tmp']),
    new ExtractTextPlugin('assets/stylesheets/index.bundle.css', { allChunks: true }),
    new webpack.optimize.CommonsChunkPlugin('head', 'assets/javascripts/head.bundle.js'),
    new webpack.ProvidePlugin({
      $               :'jquery',
      jQuery          :'jquery',
      'window.jQuery' :'jquery',
      _               :'lodash',
      math            :'mathjs',
      d3              :'d3'
    }),
  ]
}