module CacheWarmer
  # Warms urls in public/urls.txt
  def self.run
    UrlsFile.ensure_exists
    cmd = "wget --output-document=/dev/null --header='Cache-Control: no-cache' --tries=1 --quiet --base=#{ENV['API_HOST']} --input-file=#{UrlsFile::URLS_FILE}"
    Kernel.system cmd
  end

  module UrlsFile
    URLS_FILE = "#{Rails.root}/public/urls.txt".freeze
    # Generates list of urls to warm in public/urls.txt
    def self.generate
      File.open(URLS_FILE, 'w') do |f|
        urls_to_warm.each do |url|
          f << url
          f << "\n"
        end
      end
    end

    def self.ensure_exists
      generate unless File.exist?(URLS_FILE)
    end

    private

    def self.urls_to_warm
      context = Api::V3::Context.
        joins(:commodity, :country).
        find_by('countries.iso2' => 'BR', 'commodities.name' => 'SOY')
      volume_attribute = Dictionary::Quant.instance.get('Volume')
      raise 'Quant Volume not found' unless volume_attribute.present?
      years = context.flows.joins(:flow_quants).
        where('flow_quants.quant_id' => volume_attribute.id).
        distinct('flows.year').
        pluck(:year).
        sort
      top_profile_urls(context, years, volume_attribute) +
        node_attributes_urls(context, years)
    end

    # Generates urls for node attributes
    def self.node_attributes_urls(context, years)
      years.map do |year|
        "/api/v3/contexts/#{context.id}/nodes/attributes?start_year=#{year}&end_year=#{year}"
      end
    end

    # Generates urls for top 10 actor and place profiles
    def self.top_profile_urls(context, years, volume_attribute)
      years.map do |year|
        top_place_profile_urls(context, year, volume_attribute) +
          top_actor_profile_urls(context, year, volume_attribute)
      end.flatten
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
