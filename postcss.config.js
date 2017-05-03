let path        = require('path'),
    ASSETS_DIR  = path.resolve('source/', 'assets/')

module.exports = {
  plugins: [
    require('postcss-assets')({
      basePath: 'source/assets/',
      // basePath: '..',
      relative: 'source/',
      // relative: true,
      // loadPaths: [ path.resolve(ASSETS_DIR, 'fonts/'), path.resolve(ASSETS_DIR, 'images/') ],
      loadPaths: [ 'fonts/', 'images/' ]
    }),
    require('autoprefixer')()
  ]
}
