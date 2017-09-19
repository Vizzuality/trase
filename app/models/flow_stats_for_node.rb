class FlowStatsForNode

  def initialize(context, year, node, node_type)
    @context = context
    @year = year
    @node = node
    @node_type = node_type
    @node_index = node_index(@node_type)
  end

  def available_years_for_indicator(indicator_type, indicator_name)
    query = Flow.select(:year).where('? = ANY(flows.path)', @node.id)
    query = if indicator_type == 'quant'
      query.joins(flow_quants: :quant).where('quants.name' => indicator_name)
    elsif indicator_type == 'ind'
      query.joins(flow_inds: :ind).where('inds.name' => indicator_name)
    end.order(:year).distinct
    query.map{ |y| y['year'] }
  end

  def nodes_by_year_for_indicator(indicator_type, indicator_name)
    value_table, dict_table = if indicator_type == 'quant'
      ['flow_quants', 'quants']
    elsif indicator_type == 'ind'
      ['flow_inds', 'inds']
    end
    select_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["year, flows.path[?] AS node_id, sum(CAST(#{value_table}.value AS DOUBLE PRECISION)) AS value, nodes.name AS name",
      @node_index]
    )
    nodes_join_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["LEFT JOIN nodes ON nodes.node_id = flows.path[?] AND node_id IN (?)",
      @node_index, top_nodes_for_quant(indicator_name).map(&:node_id)]
    )
    group_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["flows.path[?], nodes.name, year",
      @node_index]
    )
    values_per_year = Flow.select(select_clause).
      joins("LEFT JOIN #{value_table} ON flows.flow_id = #{value_table}.flow_id").
      joins("LEFT JOIN #{dict_table} ON #{dict_table}.#{indicator_type}_id = #{value_table}.#{indicator_type}_id").
      joins(nodes_join_clause).
      where('flows.context_id' => @context.id).
      where('? = ANY(path)', @node.id).
      where("#{dict_table}.name" => indicator_name).
      group(group_clause)
  end

  def municipalities_count(quant_name)
    Flow.from(
      '(' +
      nodes_of_type_with_flows_of_quant(NodeTypeName::MUNICIPALITY, quant_name).to_sql +
      ') s'
    ).count
  end

  def source_municipalities_count(quant_name)
    Flow.from(
      '(' +
      nodes_of_type_with_flows_of_quant_into_node(NodeTypeName::MUNICIPALITY, quant_name).to_sql +
      ') s'
    ).count
  end

  def node_totals_for_quants(other_node_id, other_node_type, quant_names)
    other_node_index = node_index(other_node_type)
    nodes_join_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["LEFT JOIN nodes ON nodes.node_id = flows.path[?]",
      other_node_index]
    )
    group_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["flows.path[?], quants.name",
      other_node_index]
    )
    Flow.select('sum(CAST(flow_quants.value AS DOUBLE PRECISION)) AS value, quants.name').
      joins('LEFT JOIN flow_quants ON flows.flow_id = flow_quants.flow_id').
      joins('LEFT JOIN quants ON quants.quant_id = flow_quants.quant_id').
      joins(nodes_join_clause).
      where('nodes.name NOT LIKE ?', 'UNKNOWN%').
      where('flows.context_id' => @context.id).
      where('? = ANY(path) AND ? = ANY(path)', @node.id, other_node_id).
      where('quants.name' => quant_names).
      where(year: @year).
      group(group_clause)
  end

  # Returns the node's ranking across all nodes of same type within given state
  # for given indicator
  # for selected year
  def state_ranking(state, indicator_type, indicator_name)
    value_table, dict_table = if indicator_type == 'quant'
      ['node_quants', 'quants']
    elsif indicator_type == 'ind'
      ['node_inds', 'inds']
    end
    query = @node.
      same_type_nodes_in_state_indicator_values(state, indicator_type, indicator_name).
      select(
        'nodes.node_id',
        "DENSE_RANK() OVER (ORDER BY #{value_table}.value DESC) AS rank"
      ).
      where(
        "#{value_table}.year = ? OR NOT COALESCE(#{dict_table}.place_factsheet_temporal, FALSE)",
        @year
      )

    result = Node.from('(' + query.to_sql + ') s').
      select('s.*').
      where('s.node_id' => @node.id).
      order(nil).
      first

    result && result['rank'] || nil
  end

  # Returns the node's average across all nodes of same type within given state
  # for given indicator
  # for all years
  def state_average(state, indicator_type, indicator_name)
    value_table, dict_table = if indicator_type == 'quant'
      ['node_quants', 'quants']
    elsif indicator_type == 'ind'
      ['node_inds', 'inds']
    end
    query = @node.
      same_type_nodes_in_state_indicator_values(state, indicator_type, indicator_name).
      select(
        'nodes.node_id',
        "#{value_table}.year",
        "AVG(#{value_table}.value) OVER (PARTITION BY #{value_table}.year) AS value"
      )

    result = Node.from('(' + query.to_sql + ') s').
      select('s.*').
      where('s.node_id' => @node.id).
      order(nil)
  end

  # Returns the node's ranking across all nodes of same type within given context country
  # for given indicator
  # for selected year
  def country_ranking(context, indicator_type, indicator_name)
    value_table, dict_table = if indicator_type == 'quant'
      ['node_quants', 'quants']
    elsif indicator_type == 'ind'
      ['node_inds', 'inds']
    end
    flows_join_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["JOIN flows ON nodes.node_id = flows.path[?]",
      @node_index]
    )
    query = Node.
      select(
        'nodes.node_id',
        "DENSE_RANK() OVER (ORDER BY #{value_table}.value DESC) AS rank"
      ).
      where(node_type_id: @node.node_type_id).
      joins(flows_join_clause).
      where('flows.context_id' => context.id).
      joins(value_table => indicator_type).
      where("#{dict_table}.name" => indicator_name, "#{value_table}.year" => 2015).
      distinct

    result = Node.from('(' + query.to_sql + ') s').
      select('s.*').
      where('s.node_id' => @node.id).
      order('rank ASC').
      first

    result && result['rank'] || nil #TODO
  end

  def top_nodes_for_quant(quant_name, include_domestic_consumption = true)
    all_nodes_for_quant(quant_name, include_domestic_consumption).limit(10)
  end

  def all_nodes_for_quant(quant_name, include_domestic_consumption = true)
    select_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["flows.path[?] AS node_id, sum(CAST(flow_quants.value AS DOUBLE PRECISION)) AS value, nodes.name AS name, nodes.is_domestic_consumption AS is_domestic_consumption, nodes.geo_id",
      @node_index]
    )
    nodes_join_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["LEFT JOIN nodes ON nodes.node_id = flows.path[?]",
      @node_index]
    )
    group_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["flows.path[?], nodes.name, nodes.geo_id, nodes.is_domestic_consumption",
      @node_index]
    )
    Flow.select(select_clause).
      joins('LEFT JOIN flow_quants ON flows.flow_id = flow_quants.flow_id').
      joins('LEFT JOIN quants ON quants.quant_id = flow_quants.quant_id').
      joins(nodes_join_clause).
      where('(nodes.is_unknown is NULL OR nodes.is_unknown = false)' + (include_domestic_consumption ? '' : ' AND (nodes.is_domestic_consumption is NULL or nodes.is_domestic_consumption = false)')).
      where('flows.context_id' => @context.id).
      where('? = ANY(path)', @node.id).
      where('quants.name' => quant_name).
      where(year: @year).
      group(group_clause).
      order('value DESC')
  end

  private

  def node_index(node_type)
    NodeType.node_index_for_type(@context, node_type)
  end

  def nodes_of_type_with_flows_of_quant(node_type, quant_name)
    other_node_index = node_index(node_type)
    select_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["flows.path[?] AS node_id", other_node_index]
    )
    group_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ["flows.path[?]", other_node_index]
    )
    Flow.
      select(select_clause).
      joins(flow_quants: :quant).
      where('quants.name' => quant_name).
      group(group_clause)
  end

  def nodes_of_type_with_flows_of_quant_into_node(node_type, quant_name)
    nodes_of_type_with_flows_of_quant(node_type, quant_name).
      where('flows.path[?] = ?', @node_index, @node.id) # TODO shouldn't this be for particular position in path
  end
end
