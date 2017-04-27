class ActorAttributes

  def initialize(context, node)
    @context = context
    @node = node
    @node_type = @node.node_type.node_type
    @data = {
      node_name: @node.name,
      summary: 'data missing',
      column_name: @node_type,
      country_name: @context.country.name,
      country_geo_id: @context.country.iso2
    }
    (@node.actor_quals + @node.actor_quants + @node.actor_inds).each do |q|
      @data[q['name'].downcase] = q['value']
    end

    @data = @data.merge(top_countries)
    @data = @data.merge(top_sources)
  end

  def result
    {
      data: @data
    }
  end

  def top_countries
    top_nodes_summary(NodeTypeName::COUNTRY, :top_countries)
  end

  def top_sources
    {
      top_sources: [NodeTypeName::MUNICIPALITY, NodeTypeName::BIOME, NodeTypeName::STATE].map do |node_type|
        top_nodes_summary(node_type, node_type.downcase)
      end
    }
  end

  private

  def top_nodes_summary(node_type, node_list_label)
    top_volume_nodes = TopVolumeNodes.new(@context, @node, node_type)
    top_volume_nodes_by_year = top_volume_nodes.top_volume_nodes_by_year
    years = top_volume_nodes.years
    {
      node_list_label => {
        included_years: years,
        lines: top_volume_nodes.top_volume_nodes.map do |node|
          {
            name: node['name'],
            geo_id: node['geo_id'],
            values: years.map do |year|
              top_volume_nodes_by_year.select do |v|
                v['node_id'] == node['node_id'] && v['year'] == year
              end.first['value']
            end
          }
        end
      }
    }

  end
end
