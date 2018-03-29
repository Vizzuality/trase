module CacheWarmer
  # Warms urls in public/urls.txt
  def self.run
    cmd = "wget --output-document=/dev/null --header='Cache-Control: no-cache' --tries=1 --quiet --base=#{ENV['API_HOST']} --input-file=#{UrlsFile::URLS_FILE}"
    Kernel.system cmd
  end

  module UrlsFile
    URLS_FILE = "#{Rails.root}/public/urls.txt".freeze
    # Generates list of urls to warm in public/urls.txt
    def self.generate
      File.open(URLS_FILE, 'w') do |f|
        top_profile_urls.each do |url|
          f << url
          f << "\n"
        end
      end
    end

    def self.ensure_exists
      generate unless File.exist?(URLS_FILE)
    end

    # Generates urls for top 10 actor and place profiles
    def self.top_profile_urls
      context = Api::V3::Context.
        joins(:commodity, :country).
        find_by('countries.iso2' => 'BR', 'commodities.name' => 'SOY')
      volume_attribute = Dictionary::Quant.instance.get('Volume')
      raise 'Quant Volume not found' unless volume_attribute.present?
      top_place_profile_urls(context, 2015, volume_attribute) +
        top_actor_profile_urls(context, 2015, volume_attribute)
    end

    def self.top_place_profile_urls(context, year, attribute)
      top_nodes(context, year, attribute, NodeTypeName::MUNICIPALITY).map do |node|
        "/api/v3/contexts/#{context.id}/nodes/#{node['node_id']}/place?year=#{year}"
      end
    end

    def self.top_actor_profile_urls(context, year, attribute)
      top_nodes(context, year, attribute, NodeTypeName::EXPORTER).map do |node|
        "/api/v3/contexts/#{context.id}/nodes/#{node['node_id']}/actor?year=#{year}"
      end
    end

    def self.top_nodes(context, year, attribute, node_type_name)
      top_nodes_list = Api::V3::Profiles::TopNodesForContextList.new(
        context,
        year_start: year,
        year_end: year,
        other_node_type_name: node_type_name
      )
      top_nodes_list.
        sorted_list(
          attribute,
          include_domestic_consumption: false,
          limit: 10
        )
    end
  end
end
