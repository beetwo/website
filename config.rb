require 'yaml'
require 'fileutils'
# require 'redcarpet'

# set environment
# ————————————————————————————————
ENV['WEBPACK_ENV'] ||= (build? ? 'build' : 'development')

# Time.zone = "UTC"

# WEBPACK asset pipeline
# ————————————————————————————————
activate :external_pipeline,
  name: :webpack,
  command: build? ?
    "BUILD_PRODUCTION=1 ./node_modules/webpack/bin/webpack.js --bail -p" :
    "BUILD_DEVELOPMENT=1 ./node_modules/webpack/bin/webpack.js --watch -d --progress --color",
  source: ".tmp/dist",
  latency: 1

# General configuration
activate :meta_tags

set :relative_links,  true
# set :http_prefix,     'beetwo'
set :css_dir,         'assets/stylesheets'
set :js_dir,          'assets/javascripts'
set :images_dir,      'assets/images'


# Build-specific configuration
set :build_dir, "beetwo"
configure :build do
  set :trailing_slash, false

  # set :protocol, "https://"
  # set :google_analytics_id, 'XXXXXXXX'

  # set :mailchimp_form_id,   'XXXXXXXX'

  # activate :asset_hash, ignore: [/touch-icon.*png/]
  activate :gzip, exts: %w(.js .css .html .htm .svg .ttf .otf .woff .eot)
end

# Live Reload
# ————————————————
configure :development do
  set :protocol, 'http://'
  set :host, 'localhost'
  set :port, '4567'
  activate :livereload # Reload the browser automatically whenever files change
end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false
page 'sitemap.html', layout: false
page "/sitemap.xml", layout: false
page "/feed.xml", layout: false

# With alternative layout
# page "/path/to/file.html", layout: :otherlayout


# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# puts 'loading proxy pages'
# projects = YAML.load_file('data/projects.yml')
# projects.each do |p|
#   proxy "/projects/#{p['id']}.html", "/projects/template.html", :locals => { :project => p }, :ignore => true
# end

###
# Helpers
###

# Methods defined in the helpers block are available in templates
helpers do
  def load_markdown(path)
    puts "loading #{path}"
    file = File.new(path, 'r')
    file.read
  end

  def menu_class(item)
    return "active item #{item.id}" if page_classes.split(' ').include?( item.id )
    return "item #{item.id}"
  end
end


