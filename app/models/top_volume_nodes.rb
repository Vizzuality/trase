class TopVolumeNodes
  attr_reader :node_index

  def initialize(context, node, node_type)
    @context = context
    @node = node
    @node_type = node_type
    @node_index = ContextNode.joins(:node_type).
      where(context_id: @context.id).
      where('node_types.node_type' => @node_type).
      pluck(:column_position).first + 1
  end

  def top_volume_nodes
    select_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["flows.path[?] AS node_id, sum(CAST(flow_quants.value AS DOUBLE PRECISION)) AS value, nodes.name AS name, nodes.geo_id",
      @node_index]
    )
    nodes_join_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["LEFT JOIN nodes ON nodes.node_id = flows.path[?] AND nodes.name not LIKE 'UNKNOWN%'",
      @node_index]
    )
    group_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["flows.path[?], nodes.name, nodes.geo_id",
      @node_index]
    )
    Flow.select(select_clause).
      joins('LEFT JOIN flow_quants ON flows.flow_id = flow_quants.flow_id').
      joins("JOIN quants ON quants.quant_id = flow_quants.quant_id AND quants.name = 'Volume'").
      joins(nodes_join_clause).
      where('flows.context_id' => @context.id).
      where('? = ANY(path)', @node.id).
      where(year: @context.default_year).
      group(group_clause).
      order('value DESC').
      limit(10)
  end

  def top_volume_nodes_by_year
    select_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["year, flows.path[?] AS node_id, sum(CAST(flow_quants.value AS DOUBLE PRECISION)) AS value, nodes.name AS name",
      node_index]
    )
    nodes_join_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["LEFT JOIN nodes ON nodes.node_id = flows.path[?] AND node_id IN (?)",
      node_index, top_volume_nodes.map(&:node_id)]
    )
    group_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["flows.path[?], nodes.name, year",
      node_index]
    )
    values_per_year = Flow.select(select_clause).
      joins('LEFT JOIN flow_quants ON flows.flow_id = flow_quants.flow_id').
      joins("JOIN quants ON quants.quant_id = flow_quants.quant_id AND quants.name = 'Volume'").
      joins(nodes_join_clause).
      where('flows.context_id' => @context.id).
      where('? = ANY(path)', @node.id).
      group(group_clause)
  end

  def years
    top_volume_nodes_by_year.distinct.pluck(:year)
  end

end
