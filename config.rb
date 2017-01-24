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

# set :css_dir, 'beetwo/assets/stylesheets'
# set :js_dir, 'beetwo/assets/javascripts'
# set :images_dir, 'beetwo/assets/images'
set :relative_links, true
set :css_dir, 'assets/stylesheets'
set :js_dir, 'assets/javascripts'
set :images_dir, 'assets/images'

# Build-specific configuration
configure :build do
  set :trailing_slash, false
  set :protocol, "https://"
  # set :host, "rossta.net"
  set :google_analytics_id, 'XXXXXXXX'
  set :mailchimp_form_id,   'XXXXXXXX'

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

# Blog
# ————————————————

# before activating the blog, copy the news items from the data folder into the source folder
puts 'loading news'
puts '————————————————'
news = Dir['data/news/*']
news.each do |src|
  dst = src.gsub(/\.md$/, '.html.md')
  dst.gsub!(/data\/news\//, 'source/news/')
  FileUtils.copy(src, dst)
end

activate :blog do |blog|
  # This will add a prefix to all links, template references and source paths
  # blog.prefix = "blog"

  # blog.permalink = "{year}/{month}/{day}/{title}.html"
  # Matcher for blog source files
  blog.sources = 'news/{year}-{month}-{day}-{title}.html'
  # blog.taglink = "tags/{tag}.html"
  # blog.layout = "layout"
  # blog.summary_separator = /(READMORE)/
  # blog.summary_length = 250
  # blog.year_link = "{year}.html"
  # blog.month_link = "{year}/{month}.html"
  # blog.day_link = "{year}/{month}/{day}.html"
  # blog.default_extension = ".markdown"

  # blog.tag_template = "tag.html"
  # blog.calendar_template = "calendar.html"

  # Enable pagination
  # blog.paginate = true
  # blog.per_page = 10
  # blog.page_link = "page/{num}"
end

# set :markdown_engine, :redcarpet

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false
page "/sitemap.xml", layout: false
page "/feed.xml", layout: false

# With alternative layout
# page "/path/to/file.html", layout: :otherlayout
page 'sitemap.html', layout: false
page 'sitemap.xml', layout: false
page 'feed.xml', layout: false


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

# Build-specific configuration
configure :build do
  # Minify CSS on build
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript
end

