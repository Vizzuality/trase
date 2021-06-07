SitemapGenerator::Sitemap.default_host = "https://supplychains.trase.earth"
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
      year = years.max
      html_query_params = {
        'nodeId' => node_id,
        'contextId' => context_id,
        'year' => year
      }
      html_url = "/profile-#{profile}"+ '?' + html_query_params.to_query
      print_url = "/profile-#{profile}"+ '?' + html_query_params.merge(print: true).to_query
      pdf_query_params = {
        'filename' => 'TRASE - Profiles.pdf',
        'url' => SitemapGenerator::Sitemap.default_host + print_url
      }
      pdf_url = '/api/v1/webshot?' + pdf_query_params.to_query
      add html_url, :changefreq => 'monthly'
      add pdf_url, :changefreq => 'monthly'
    end

  add'/data', :changefreq => 'monthly'
end
