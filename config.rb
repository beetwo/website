#encoding: utf-8

require 'yaml'
require 'fileutils'

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
activate :i18n, :mount_at_root => :en

set :relative_links,  true
# set :http_prefix,     'build'
set :css_dir,         'assets/stylesheets'
set :js_dir,          'assets/javascripts'
set :images_dir,      'assets/images'


# Build-specific configuration
set :build_dir, "build"
configure :build do
  set :trailing_slash, false
  # set :protocol, "https://"
  # set :google_analytics_id, 'XXXXXXXX'
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

# Blogs
# ————————————————
activate :blog do |blog|
  blog.name       = "projects"
  blog.prefix     = "projects"
  blog.layout     = "project_layout"
  blog.sources    = "{title}.html"
  # blog.permalink  = "projects/{title}.html"
end

activate :blog do |blog|
  blog.name       = "team"
  blog.prefix     = "team"
  blog.layout     = "team_layout"
  blog.sources    = "{title}.html"
  # blog.permalink  = "projects/{title}.html"
end

activate :blog do |blog|
  blog.name       = "texts"
  blog.prefix     = "texts"
  blog.sources    = "{title}.html"
  # blog.permalink  = "projects/{title}.html"
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

# texts
# longer texts  are maintained within the data/texts folder
# to make access easier we copy all these files into the partials folder upon load
# FileUtils.cp_r "data/texts/.", 'source/partials/texts'

# prevent annoying HAML warnings
Haml::TempleEngine.disable_option_validator!

###
# Helpers
###

# Methods defined in the helpers block are available in templates
helpers do
  def tel_to(text)
    groups = text.to_s.scan(/(?:^\+)?\d+/)
    if groups.size > 1 && groups[0][0] == '+'
      # remove leading 0 in area code if this is an international number
      groups[1] = groups[1][1..-1] if groups[1][0] == '0'
      groups.delete_at(1) if groups[1].size == 0 # remove if it was only a 0
    end
    link_to text, "tel:#{groups.join '-'}"
  end

  def markdown(text)
    Tilt['markdown'].new { text }.render()
  end

  def get_text(title)
    blog("texts").articles.detect {|e| e.title == title}.render(:layout => false)
  end

  def menu_link(path, anchor)
    link = "#{anchor}" if path.eql? "index.html"
    link = "/index.html#{anchor}" unless path.eql? "index.html"
    link
  end

  def project_images(project)
    (0..3)
      .map    { |i| project["image#{i}"]}
      .select { |x| !x.nil? }
  end
end

