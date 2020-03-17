SitemapGenerator::Sitemap.default_host = "https://trase.earth"
SitemapGenerator::Sitemap.compress = false
SitemapGenerator::Sitemap.public_path = '/var/www/trase/current/frontend/dist/'
SitemapGenerator::Sitemap.create do
  add('/',
    :video => {
      :thumbnail_loc => 'https://bit.ly/2EmI6CH',
      :title => 'Introducing Trase',
      :description => 'Trase is a supply chain transparency initiative that transforms our understanding of globally traded agricultural commodities.',
      :content_loc => 'https://bit.ly/2HU1SpU',
      :tags => %w[trase supply chain transparency SEI Global Canopy],
      :category => 'Nonprofits & Activism',
    },
    :changefreq => 'monthly'
  )

  add'/explore', :changefreq => 'monthly'
  add'/flows', :changefreq => 'monthly'
  add'/profiles', :changefreq => 'monthly'

  Api::V3::Readonly::NodeWithFlows.
    without_unknowns.
    without_domestic.
    with_profile.
    pluck(:id, :context_id, :profile, :years).
    each do |node_id, context_id, profile, years|
      years.each do |year|
        add "/profile-#{profile}?nodeId=#{node_id}&year=#{year}&contextId=#{context_id}", :changefreq => 'monthly'
      end
    end

  add'/data', :changefreq => 'monthly'
  add'/about', :changefreq => 'yearly'

  Content::Page.all.map(&:name).each do |page|
    add "/about/#{page}", :changefreq => 'yearly'
  end
end
