class PlaceAttributes

  def initialize(context, node)
    @context = context
    @node = node
    @node_type = @node.node_type.node_type

    # single_quant_values = NodeQuant
    #                            .select('quants.name, quants.unit, quants.unit_type, quants.frontend_name, quants.tooltip_text, node_quants.value')
    #                            .joins(:quant)
    #                            .joins(:node)
    #                            .where('place_factsheet IS TRUE AND (place_factsheet_temporal IS NULL OR place_factsheet_temporal IS FALSE) AND nodes.node_id = :node_id', {:node_id => node_id})
    #                            .as_json

    # single_qual_values = NodeQual
    #                           .select('quals.name, NULL as unit, NULL as unit_type, quals.frontend_name, quals.tooltip_text, node_quals.value')
    #                           .joins(:qual)
    #                           .joins(:node)
    #                           .where('place_factsheet IS TRUE AND (place_factsheet_temporal IS NULL OR place_factsheet_temporal IS FALSE) AND nodes.node_id = :node_id', {:node_id => node_id})
    #                           .as_json

    # single_ind_values = NodeInd
    #                          .select('inds.name, inds.unit, inds.unit_type, inds.frontend_name, inds.tooltip_text, node_inds.value')
    #                          .joins(:ind)
    #                          .joins(:node)
    #                          .where('place_factsheet IS TRUE AND (place_factsheet_temporal IS NULL OR place_factsheet_temporal IS FALSE) AND nodes.node_id = :node_id', {:node_id => node_id})
    #                          .as_json

    # @temporal_quants = Quant
    #               .select('quants.name, quants.frontend_name, quants.tooltip_text, quants.quant_id, node_quants.value,  node_quants.year')
    #               .joins(node_quants: [:node])
    #               .where('place_factsheet IS TRUE AND place_factsheet_temporal IS TRUE AND nodes.node_id = :node_id', { :node_id => node_id })

    @data = {
      column_name: @node_type,
      country_name: @context.country.name,
      country_geo_id: @context.country.iso2
    }
    ([@node] + @node.ancestors.to_a).each do |node|
      @data[(node.node_type.node_type.downcase + '_name').to_sym] = node.name
      @data[(node.node_type.node_type.downcase + '_geo_id').to_sym] = node.geo_id
    end

    if [NodeTypeName::MUNICIPALITY, NodeTypeName::LOGISTICS_HUB].include? @node_type
      @data = @data.merge(municipality_and_logistics_hub_extra_data)
    end

    @data = @data.merge(top_traders)
  end

  def result
    {
      data: @data
    }
  end

  def municipality_and_logistics_hub_extra_data
    data = {}
    place_quals = @node.place_quals
    place_quants = @node.place_quants
    place_inds = @node.place_inds

    biome_name = place_quals[NodeTypeName::BIOME]['value']
    biome = Node.biomes.find_by_name(biome_name)
    data[:biome_name] = biome_name
    data[:biome_geo_id] = biome.try(:geo_id)
    state_name = place_quals[NodeTypeName::STATE]['value']
    state = Node.states.find_by_name(state_name)
    data[:state_name] = state_name
    data[:state_geo_id] = state.try(:geo_id)
    if place_quants['AREA_KM2'].present?
      data[:area] = place_quants['AREA_KM2']['value']
    end
    if place_inds['SOY_AREAPERC'].present?
      data[:soy_farmland] = place_inds['SOY_AREAPERC']['value']
    end
    data
  end

  def top_traders
    trader_index = ContextNode.joins(:node_type).
      where(context_id: @context.id).
      where('node_types.node_type' => NodeTypeName::EXPORTER).
      pluck(:column_position).first

    select_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["flows.path[?] AS trader_id, sum(CAST(flow_quants.value AS DOUBLE PRECISION)) AS value, nodes.name AS name",
      trader_index]
    )
    nodes_join_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["LEFT JOIN nodes ON nodes.node_id = flows.path[?] AND nodes.name not LIKE 'UNKNOWN%'",
      trader_index]
    )
    group_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["flows.path[?], nodes.name",
      trader_index]
    )
    top_traders = Flow.select(select_clause).
      joins('LEFT JOIN flow_quants ON flows.flow_id = flow_quants.flow_id').
      joins("JOIN quants ON quants.quant_id = flow_quants.quant_id AND quants.name = 'Volume'").
      joins(nodes_join_clause).
      where('flows.context_id' => @context.id).
      where('? = ANY(path)', @node.id).
      where(year: @context.default_year).
      group(group_clause).
      order('value DESC').
      limit(10)

    sum_traders = top_traders.map{ |t| t[:value] }.reduce(0, :+)

    matrix = [
      [0] + top_traders.map{ |t| t['value'] },
      top_traders.map{ |t| [t['value']] + Array.new((top_traders.size - 1), 0) }
    ]

    {
      top_traders: {
        actors: top_traders.map{ |t| {id: t['trader_id'], name: t['name'], value: t['value']/sum_traders} },
        matrix: matrix
      }
    }
  end
end
