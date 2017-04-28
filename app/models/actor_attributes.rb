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
    @data = @data.merge(sustainability)
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

  def sustainability
    {
      sustainability: [
        {group_name: 'Municipalities', node_type: NodeTypeName::MUNICIPALITY},
        {group_name: 'Biomes', node_type: NodeTypeName::BIOME, is_total: true}
      ].map do |group|
        sustainability_for_group(group[:name], group[:node_type], group[:is_total])
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

  def risk_indicators
    [
      {name: 'Maximum soy deforestation', unit: 'ha', backend_name: 'DEFORESTATION'},
      {name: 'Soy deforestation', unit: 'ha', backend_name: 'SOY_DEFORESTATION'},
      {name: 'Biodiversity loss', backend_name: 'BIODIVERSITY'}
    ]
  end

  def sustainability_for_group(name, node_type, include_totals)
    group_totals_hash = Hash.new
    top_nodes_in_group = TopVolumeNodes.new(@context, @node, node_type).top_deforestation_nodes
    rows = top_nodes_in_group.map do |node|
      top_nodes = TopVolumeNodes.new(@context, @node, @node_type)
      totals_per_indicator = top_nodes.node_totals_for_quants(
        node['node_id'], node_type, risk_indicators.map{ |i| i[:backend_name] }
      )
      totals_hash = Hash[totals_per_indicator.map{ |t| [t['name'], t['value']] }]
      totals_hash.each do |k, v|
        if group_totals_hash[k]
          group_totals_hash[k] += v
        else
          group_totals_hash[k] = v
        end
      end
      {
        values:
          [
            {
              id: node['node_id'],
              value: node['name']
            }
          ] +
          risk_indicators.map do |quant|
            if totals_hash[quant[:backend_name]]
              {value: totals_hash[quant[:backend_name]]}
            else
              nil
            end
          end
      }
    end
    if include_totals
      rows << {
        is_total: true,
        values: risk_indicators.map do |quant|
          if group_totals_hash[quant[:backend_name]]
            {value: group_totals_hash[quant[:backend_name]]}
          else
            nil
          end
        end
      }
    end
    {
      name: name,
      included_columns: [{name: node_type.humanize}] + risk_indicators.map{ |indicator| indicator.slice(:name, :unit) },
      rows: rows
    }
  end
end
