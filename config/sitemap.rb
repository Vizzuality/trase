SitemapGenerator::Sitemap.default_host = "http://trase.earth"
SitemapGenerator::Sitemap.create do
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
