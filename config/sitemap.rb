SitemapGenerator::Sitemap.default_host = "http://trase.earth"

# TODO: Language query needed

SitemapGenerator::Sitemap.create do
  add'/explore'
  add'/flows'
  add'/profiles'

  contexts = Api::V3::Context.all;
  contexts.each do |context|
    context.years.each do |year|
      Api::V3::Readonly::Node.where(profile: 'place').map(&:id).each do |nodeId|
        add "/profile-place?nodeId=#{nodeId}&year=#{year}&contextId=#{context.id}"
      end
      Api::V3::Readonly::Node.where(profile: 'actor').map(&:id).each do |nodeId|
        add "/profile-actor?nodeId=#{nodeId}&year=#{year}&contextId=#{context.id}"
      end
    end
  end

  add'/data'
  add'/about'
  Content::Page.all.map(&:name).each do |page|
    add "/about/#{page}"
  end
end
