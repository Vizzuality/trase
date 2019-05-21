SitemapGenerator::Sitemap.default_host = "http://trase.earth"

# TODO: Language query needed

SitemapGenerator::Sitemap.create do
  add'/explore'
  add'/flows'
  add'/profiles'

  place_ids = Api::V3::NodeType.where(name: ['MUNICIPALITY', 'LOGISTICS HUB'])).map {|z| z.id }
  Api::V3::Node.where(node_type_id: place_ids, is_unknown: false).map(&:id).each do |nodeId|
    add "/profile-place?nodeId=#{nodeId}&contextId=#{contextId}&year=#{year}"
  end

  actor_ids = Api::V3::NodeType.where(name: ['IMPORTER', 'EXPORTER'])).map {|z| z.id }
    Api::V3::Node.where(node_type_id: actor_ids, is_unknown: false).map(&:id).each do |nodeId|
    add "/profile-actor?nodeId=#{nodeId}&contextId=#{contextId}&year=#{year}"
  end

  add'/data'
  add'/about'
  Content::Page.all.map(&:name).each do |page|
    add "/about/#{page}"
  end
end
