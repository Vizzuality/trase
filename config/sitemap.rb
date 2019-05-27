SitemapGenerator::Sitemap.default_host = "http://trase.earth"
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
  contexts = Api::V3::Context.all;
  contexts.each do |context|
    Api::V3::Readonly::Node.
      where(context_id: context.id).
      where(profile: ['place', 'actor']).
      pluck(:id, :profile).
      each do |nodeId, profile|
        context.years.each do |year|
          add "/profile-#{profile}?nodeId=#{nodeId}&year=#{year}&contextId=#{context.id}", :changefreq => 'monthly'
        end
      end
  end

  add'/data', :changefreq => 'monthly'
  add'/about', :changefreq => 'yearly'

  Content::Page.all.map(&:name).each do |page|
    add "/about/#{page}", :changefreq => 'yearly'
  end
end
