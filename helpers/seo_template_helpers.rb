# Methods defined in the helpers block are available in templates
module SeoTemplateHelpers
  def page_title
    current_page.data.title || data.meta.title
  end

  def page_description
    current_page.data.description || data.meta.description
  end

  def current_page_url
    "#{data.meta.url}#{current_page.url}"
  end

  def site_url
    "#{data.meta.url}"
  end

  def page_url page
    "#{data.meta.url}#{page.url}"
  end

  def page_twitter_card_type
    current_page.data.twitter_card_type || 'summary'
  end

  def page_image
    current_page.data.image_path || data.meta.logo_image_path
  end

  # Social share URLs
  def twitter_url
    "https://twitter.com/share?text=“#{page_title}”" +
                               "&url=#{current_page_url}" +
                               "&via=#{data.meta.twitter_handle}"
  end

  def facebook_url
    "https://www.facebook.com/dialog/feed?app_id=#{data.meta.facebook_app_id}" +
                                          "&caption=#{page_title}" +
                                          "&picture=#{page_image}" +
                                          "&name=“#{page_title}”" +
                                          "&description=#{page_description}" +
                                          "&display=popup" +
                                          "&link=#{current_page_url}" +
                                          "&redirect_uri=#{current_page_url}"
  end

  def google_plus_url
    "https://plus.google.com/share?url=#{current_page_url}"
  end

  def linkedin_url
    "http://www.linkedin.com/shareArticle?mini=true" +
                                          "&url=#{current_page_url}" +
                                          "&title=#{page_title}" +
                                          "&summary=#{page_description}" +
                                          "&source=#{data.meta.url}"
  end
end
