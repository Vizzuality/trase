SitemapGenerator::Sitemap.default_host = "http://trase.earth"
SitemapGenerator::Sitemap.create do
  add('/',
    :video => {
      :thumbnail_loc => 'https://i.ytimg.com/vi/wMnAQJBptj8/hqdefault.jpg?sqp=-oaymwEZCNACELwBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLDvbL8FkheZ4W98fX-lzgG2z6snlA',
      :title => 'Introducing Trase',
      :description => 'Trase is a supply chain transparency initiative that transforms our understanding of globally traded agricultural commodities.',
      :content_loc => 'https://www.youtube.com/embed/wMnAQJBptj8?autoplay=0&controls=0&disablekb=1&playsinline=1&cc_load_policy=0&cc_lang_pref=auto&widget_referrer=https%3A%2F%2Ftrase.earth%2F%3F&noCookie=false&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&origin=https%3A%2F%2Ftrase.earth&widgetid=1',
      :tags => %w[trase supply chain transparency SEI Global Canopy],
      :category => 'Nonprofits & Activism',
    },
    :changefreq => 'monthly'
  )

  add'/explore', :changefreq => 'monthly'
  add'/flows', :changefreq => 'monthly'
  add'/profiles', :changefreq => 'monthly'
  contexts = Api::V3::Context.all;
  contexts.each do |context|
    context.years.each do |year|
      Api::V3::Readonly::Node.where(profile: 'place').map(&:id).each do |nodeId|
        add "/profile-place?nodeId=#{nodeId}&year=#{year}&contextId=#{context.id}", :changefreq => 'monthly'
      end
      Api::V3::Readonly::Node.where(profile: 'actor').map(&:id).each do |nodeId|
        add "/profile-actor?nodeId=#{nodeId}&year=#{year}&contextId=#{context.id}", :changefreq => 'monthly'
      end
    end
  end

  add'/data', :changefreq => 'monthly'
  add'/about', :changefreq => 'yearly'

  Content::Page.all.map(&:name).each do |page|
    add "/about/#{page}", :changefreq => 'yearly'
  end
end
