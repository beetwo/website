// webpack.config.js
// @see: https://rossta.net/blog/using-webpack-with-middleman.html
let webpack           = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');
    Clean             = require('clean-webpack-plugin'),
    path              = require('path'),
    definePlugin      = new webpack.DefinePlugin({
                          __DEVELOPMENT__: JSON.stringify(JSON.parse(process.env.WEBPACK_ENV === 'development')),
                          __DEBUG__:       JSON.stringify(JSON.parse(process.env.WEBPACK_ENV === 'debug')),
                          __BUILD__:       JSON.stringify(JSON.parse(process.env.WEBPACK_ENV === 'build')),
                          __VERSION__:     (new Date().getTime().toString()) }),
    styleVariables    = 'data/style.yml'

module.exports = {
  entry: {
    index: ['./source/assets/stylesheets/index.scss',
            './source/assets/javascripts/index.js' ],
    head: './source/assets/javascripts/head.js' },

  // resolve: {
  //   root: path.join(__dirname, '/source/assets') },
  // resolve: {
  //   modules: [
  //     path.join(__dirname, 'src'),
  //     "node_modules"]
  // },

  output: {
    path: path.join(__dirname, '/.tmp/dist'),
    filename: 'assets/javascripts/[name].bundle.js' },

  module: {
    rules: [
      { test:     /\.js$/,
        loader:   'babel-loader',
        exclude:  /(node_modules|bower_components)/,
        query:    { cacheDirectory: true,
                    presets: ['env'] } },

      { test: require.resolve('jquery'),
        use:  { loader: 'expose-loader',
                options: '$' } },

      { test: require.resolve('lodash'),
        use:  { loader: 'expose-loader',
                options: '_' } },

      { test: require.resolve('mathjs'),
        use:  { loader: 'expose-loader',
          options: 'math' } },

      { test: require.resolve('d3'),
        use:  { loader: 'expose-loader',
          options: 'd3' } },

      // images
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: "file-loader?name=assets/images/[name].[ext]"},
      
      // SCSS
      { test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [

            { loader:   'css-loader',
              options : { autoprefixer: false,
                          sourceMap:    true,
                          url:          false } },

            'postcss-loader',

            { loader: 'sass-loader',
              options : { includePaths: [path.resolve(__dirname, './node_modules')]}},

            { loader: 'ymltosass-loader',
              options : { path: styleVariables } }
          ]
        })},

      // Fonts
      { test: /\.svg$/,     loader: 'url-loader?limit=65000&mimetype=image/svg+xml&name=assets/fonts/[name].[ext]' },
      { test: /\.woff$/,    loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=assets/fonts/[name].[ext]' },
      { test: /\.woff2$/,   loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=assets/fonts/[name].[ext]' },
      { test: /\.[ot]tf$/,  loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=assets/fonts/[name].[ext]' },
      { test: /\.eot$/,     loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=assets/fonts/[name].[ext]' }]},

  node: {
    console: true
  },

  plugins: [
    definePlugin,
    new Clean(['.tmp']),
    new ExtractTextPlugin({ filename: 'assets/stylesheets/index.bundle.css', allChunks: true }),
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
