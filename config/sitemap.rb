# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "http://trase.earth"

SitemapGenerator::Sitemap.create do
  add'/explore'
  add'/flows'
  add'/profiles'
  add'/data'
  add'/about'
  Content::Page.all.map(&:name).each do |page|
    add "/about/#{page}"
  end
end
