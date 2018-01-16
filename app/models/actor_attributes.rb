class ActorAttributes
  def initialize(context, year, node)
    @context = context
    @year = year && year.to_i
    @node = node
    @node_type = @node.node_type.node_type

    @stats = FlowStatsForNode.new(@context, @year, @node, @node_type)

    @actor_quals = Hash[(@node.actor_quals + @node.temporal_actor_quals(@year)).map do |e|
      [e['name'], e]
    end]
    @actor_quants = Hash[(@node.actor_quants + @node.temporal_actor_quants(@year)).map do |e|
      [e['name'], e]
    end]
    @actor_inds = Hash[(@node.actor_inds + @node.temporal_actor_inds(@year)).map do |e|
      [e['name'], e]
    end]

    @data = {
      node_name: @node.name,
      column_name: @node_type,
      country_name: @context.country.name,
      country_geo_id: @context.country.iso2
    }
    [@actor_quals, @actor_quants, @actor_inds].each do |indicator_hash|
      indicator_hash.each do |name, indicator|
        @data[name.downcase] = indicator['value']
      end
    end

    @data = @data.merge(top_countries)
    @data = @data.merge(top_sources)
    @data = @data.merge(sustainability)
    @data = @data.merge(companies_exporting)

    @data[:summary] = summary
  end

  def result
    {
      data: @data
    }
  end

  def summary
    if @node_type == NodeTypeName::EXPORTER
      exporter_summary
    else
      importer_summary
    end
  end

  def initialize_trade_volume_for_summary
    trade_flows_current_year = @node.flow_values(@context, 'quant', 'Volume').where(year: @year)
    @trade_total_current_year = trade_flows_current_year.sum('value')
    if @trade_total_current_year < 1000
      trade_total_current_year_value = @trade_total_current_year
      trade_total_current_year_unit = 'tons'
      trade_total_current_year_precision = 0
    elsif @trade_total_current_year < 1_000_000
      trade_total_current_year_value = @trade_total_current_year / 1000
      trade_total_current_year_unit = 'thousand tons'
      trade_total_current_year_precision = 0
    else
      trade_total_current_year_value = @trade_total_current_year / 1_000_000
      trade_total_current_year_unit = 'million tons'
      trade_total_current_year_precision = 1
    end

    @trade_total_current_year_formatted = helper.number_with_precision(
      trade_total_current_year_value,
      delimiter: ',', precision: trade_total_current_year_precision
    ) + ' ' + trade_total_current_year_unit

    trade_flows_previous_year = @node.flow_values(@context, 'quant', 'Volume').where(year: @year - 1)
    @trade_total_previous_year = trade_flows_previous_year.sum('value')
    if @trade_total_previous_year.present? && @trade_total_previous_year.positive?
      @trade_total_perc_difference = (@trade_total_current_year - @trade_total_previous_year) / @trade_total_previous_year
    end
    trade_total_rank_in_country = @stats.country_ranking_from_flows(@context, 'quant', 'Volume')
    if trade_total_rank_in_country && trade_total_rank_in_country > 1
      @trade_total_rank_in_country_formatted = trade_total_rank_in_country.ordinalize + ' '
    end
  end

  def summary_of_total_trade_volume(profile_type)
    initialize_trade_volume_for_summary
    text = "#{@node.name.humanize} was the #{@trade_total_rank_in_country_formatted}largest #{profile_type} of soy #{profile_type.casecmp('exporter').zero? ? 'in' : 'from'} #{@context.country.name} in #{@year}, accounting for #{@trade_total_current_year_formatted}."
    return text unless @trade_total_perc_difference.present?
    difference_from = if @trade_total_perc_difference.positive?
                        'a ' + helper.number_to_percentage(@trade_total_perc_difference * 100, precision: 0) + ' increase vs'
                      elsif @trade_total_perc_difference.negative?
                        'a ' + helper.number_to_percentage(-@trade_total_perc_difference * 100, precision: 0) + ' decrease vs'
                      else
                        'no change from'
                      end
    text + " This is #{difference_from} the previous year."
  end

  def initialize_sources_for_summary
    municipalities_count = @stats.municipalities_count('Volume')
    source_municipalities_count = @stats.source_municipalities_count('Volume')
    @perc_municipalities_formatted = helper.number_to_percentage(
      (source_municipalities_count * 100.0) / municipalities_count, precision: 0
    )
    @source_municipalities_count_formatted = helper.number_with_precision(
      source_municipalities_count, delimiter: ',', precision: 0
    )
  end

  def summary_of_sources(profile_type)
    initialize_sources_for_summary
    " As an #{profile_type}, #{@node.name.humanize} sources from \
#{@source_municipalities_count_formatted} municipalities, or \
#{@perc_municipalities_formatted} of the soy production municipalities."
  end

  def initialize_destinations_for_summary
    year_idx = @data[:top_countries][:included_years].index(@year)
    main_destination = @data[:top_countries][:lines].max do |line1, line2|
      line1[:values][year_idx] <=> line2[:values][year_idx]
    end
    if main_destination.present?
      @main_destination_name = main_destination[:name]
      main_destination_exports = main_destination[:values][year_idx]
      if main_destination_exports && @trade_total_current_year && @trade_total_current_year.positive?
        @perc_exports_formatted = helper.number_to_percentage(
          (main_destination_exports * 100.0) / @trade_total_current_year, precision: 0
        )
      end
    end
  end

  def summary_of_destinations(profile_type)
    initialize_destinations_for_summary
    if @perc_exports_formatted
      " The main destination of the soy #{profile_type.first(-1)}d by #{@node.name.humanize} \
is #{@main_destination_name.humanize}, accounting for \
#{@perc_exports_formatted} of the total."
    else
      ''
    end
  end

  def exporter_summary
    # For 1st rank:
    # Bunge was the largest exporter of soy in BRAZIL in 2015, accounting for 11,061,393 tons.
    # As an exporter, Bunge sources from 1,136 municipalities, or 44% of the soy production municipalities.
    # The main destination of the soy exported by Bunge is China, accounting for 50% of the total.

    # For all others:
    # Cargill was the 2nd largest exporter of soy in BRAZIL in 2015, accounting for 8,801,294 tons.
    # As an exporter, Cargill sources from 1,224 municipalities, or 48% of the soy production municipalities.
    # The main destination of the soy exported by Cargill is China, accounting for 66% of the total.
    text = summary_of_total_trade_volume('exporter')
    text += summary_of_sources('exporter')
    text += summary_of_destinations('exporter')
    text
  end

  def importer_summary
    # Bunge was the 1st largest importer of soy from BRAZIL in 2015, accounting for 11,061,393 tons.
    # As an importer, Bunge sources soy from 1,136 municipalities, or 44% of the soy production municipalities.
    # The main destination of the soy imported by Bunge is China, accounting for 50% of the total.

    # For all others:
    # Cargill was the 2nd largest importer of soy from BRAZIL in 2015, accounting for 8,801,294 tons.
    # As an importer, Cargill sources from 1,224 municipalities, or 48% of the soy production municipalities.
    # The main destination of the soy imported by Cargill is China, accounting for 66% of the total.
    text = summary_of_total_trade_volume('importer')
    text += summary_of_sources('importer')
    text += summary_of_destinations('importer')
    text
  end

  def top_countries
    years = @stats.available_years_for_indicator('quant', 'Volume')
    # add bucket for selected year
    volume_quant = Quant.find_by_name('SOY_TN') # TODO no bucket for Volume?
    raise 'Quant SOY_TN not found, but needed to calculate actor\'s top countries' unless volume_quant.present?

    context_layer = ContextLayer.where(
      context_id: @context.id, layer_attribute_type: 'Quant', layer_attribute_id: volume_quant.id
    ).first
    buckets = context_layer.try(:bucket_5) || [5000, 100_000, 300_000, 1_000_000] # TODO: bucket_9
    result = nodes_by_year_summary_for_indicator(NodeTypeName::COUNTRY, :top_countries, years, buckets, 'quant', 'Volume')
    result[:top_countries][:included_years] = years
    result[:top_countries][:buckets] = buckets
    result
  end

  def top_sources
    years = @stats.available_years_for_indicator('quant', 'Volume')
    # add bucket for selected year
    volume_quant = Quant.find_by_name('SOY_TN') # TODO no bucket for Volume?
    raise 'Quant SOY_TN not found, but needed to calculate actor\'s top sources' unless volume_quant.present?

    context_layer = ContextLayer.where(
      context_id: @context.id, layer_attribute_type: 'Quant', layer_attribute_id: volume_quant.id
    ).first
    buckets = context_layer.try(:bucket_5) || [5000, 100_000, 300_000, 1_000_000] # TODO: bucket_9
    result = {
      included_years: years,
      buckets: buckets
    }
    [NodeTypeName::MUNICIPALITY, NodeTypeName::BIOME, NodeTypeName::STATE].each do |node_type|
      result = result.merge nodes_by_year_summary_for_indicator(node_type, node_type.downcase, years, buckets, 'quant', 'Volume')
    end
    {
      top_sources: result
    }
  end

  def sustainability
    {
      sustainability: [
        {group_name: 'Municipalities', node_type: NodeTypeName::MUNICIPALITY},
        {group_name: 'Biomes', node_type: NodeTypeName::BIOME, is_total: true}
      ].map do |group|
        sustainability_for_group(group[:group_name], group[:node_type], group[:is_total])
      end
    }
  end

  def companies_exporting
    quant = Quant.find_by(name: 'Volume')
    raise 'Quant Volume not found, but needed to calculate actor\'s exporting companies' unless quant.present?

    unit = quant.unit
    value_divisor = 1
    if unit.casecmp('tn').zero?
      unit = 'kt'
      value_divisor = 1000
    end

    y_indicator = {
      name: 'Trade Volume', unit: unit, type: 'quant', backend_name: 'Volume'
    }
    x_indicators = [
      {name: 'Land use', unit: 'ha', type: 'quant', backend_name: 'LAND_USE'},
      {name: 'Territorial Deforestation', unit: 'ha', type: 'quant', backend_name: 'DEFORESTATION_V2'},
      {name: 'Maximum soy deforestation', unit: 'ha', type: 'quant', backend_name: 'POTENTIAL_SOY_DEFORESTATION_V2'},
      {name: 'Soy related deforestation', unit: 'ha', type: 'quant', backend_name: 'AGROSATELITE_SOY_DEFOR_'},
      {name: 'Loss of biodiversity', type: 'quant', backend_name: 'BIODIVERSITY'},
      {name: 'Land-based emissions', unit: 't', type: 'quant', backend_name: 'GHG_'}
    ]

    node_index = NodeType.node_index_for_type(@context, @node_type)
    nodes_join_clause = ActiveRecord::Base.send(
      :sanitize_sql_array,
      ['JOIN nodes ON nodes.node_id = flows.path[?] AND (NOT nodes.is_unknown OR nodes.is_unknown IS NULL) AND (NOT nodes.is_domestic_consumption OR nodes.is_domestic_consumption IS NULL)',
       node_index]
    )

    production_totals = Flow.
      select('nodes.node_id AS node_id, nodes.name, sum(CAST(flow_quants.value AS DOUBLE PRECISION)) AS value, quants.name AS quant_name').
      joins(nodes_join_clause).
      joins('JOIN node_types ON node_types.node_type_id = nodes.node_type_id').
      joins(flow_quants: :quant).
      where('flows.context_id' => @context.id).
      where('quants.name' => y_indicator[:backend_name]).
      where('node_types.node_type' => @node_type).
      where('flows.year' => @year).
      group('nodes.node_id, nodes.name, quants.name')

    indicator_totals = Flow.
      select('nodes.node_id AS node_id, nodes.name, sum(CAST(flow_quants.value AS DOUBLE PRECISION)) AS value, quants.name AS quant_name').
      joins(nodes_join_clause).
      joins('JOIN node_types ON node_types.node_type_id = nodes.node_type_id').
      joins(flow_quants: :quant).
      where('flows.context_id' => @context.id).
      where('quants.name' => x_indicators.map { |indicator| indicator[:backend_name] }).
      where('node_types.node_type' => @node_type).
      where('flows.year' => @year).
      group('nodes.node_id, nodes.name, quants.name')

    x_indicator_indexes = Hash[x_indicators.map.each_with_index do |indicator, idx|
      [indicator[:backend_name], idx]
    end]

    indicator_totals_hash = {}
    production_totals.each do |total|
      indicator_totals_hash[total['node_id']] ||= Array.new(x_indicators.size)
    end
    indicator_totals.each do |total|
      indicator_idx = x_indicator_indexes[total['quant_name']]
      if indicator_totals_hash.key?(total['node_id'])
        indicator_totals_hash[total['node_id']][indicator_idx] = total['value']
      end
    end

    exports = production_totals.map do |total|
      {
        name: total['name'],
        id: total['node_id'],
        y: total['value'].to_f / value_divisor,
        x: indicator_totals_hash[total['node_id']]
      }
    end

    {
      companies_sourcing: {
        dimension_y: y_indicator.slice(:name, :unit),
        dimensions_x: x_indicators.map { |i| i.slice(:name, :unit) },
        companies: exports
      }
    }
  end

  private

  def nodes_by_year_summary_for_indicator(node_type, node_list_label, years, buckets, indicator_type, indicator_name)
    stats = FlowStatsForNode.new(@context, @year, @node, node_type)
    volume_nodes_by_year = stats.nodes_by_year_for_indicator(indicator_type, indicator_name)

    lines = stats.all_nodes_for_quant(indicator_name).map do |node|
      {
        name: node['name'],
        geo_id: node['geo_id'],
        values: years.map do |year|
          year_node = volume_nodes_by_year.select do |v|
            v['node_id'] == node['node_id'] && v['year'] == year
          end.first
          year_node && year_node['value']
        end
      }
    end

    year_idx = years.index(@year)

    lines.each do |line|
      value = line[:values][year_idx]
      line[:value9] = bucket_index_for_value(buckets, value)
    end

    {
      node_list_label => {
        lines: lines,
        unit: 't',
        style: {
          type: 'line-points',
          style: 'line-pink-with-points'
        }
      }
    }
  end

  def bucket_index_for_value(buckets, value)
    prev_bucket = 0
    bucket = buckets.each_with_index do |bucket_value, index|
      break index if value >= prev_bucket && value < bucket_value
    end
    if bucket.is_a? Integer
      bucket
    else
      buckets.size # last bucket
    end
  end

  def risk_indicators
    [
      {backend_name: 'DEFORESTATION_V2'},
      {backend_name: 'POTENTIAL_SOY_DEFORESTATION_V2'},
      {name: 'Soy deforestation', backend_name: 'AGROSATELITE_SOY_DEFOR_'}
    ]
  end

  def sustainability_for_group(name, node_type, include_totals)
    group_totals_hash = {}
    top_nodes_in_group = FlowStatsForNode.new(@context, @year, @node, node_type).
      top_nodes_for_quant('Volume')
    rows = top_nodes_in_group.map do |node|
      totals_per_indicator = @stats.node_totals_for_quants(
        node['node_id'], node_type, risk_indicators.map { |i| i[:backend_name] }
      )
      totals_hash = Hash[totals_per_indicator.map { |t| [t['name'], t['value']] }]
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
          end
        end
      }
    end
    {
      name: name,
      included_columns:
          [{name: node_type.humanize}] +
            risk_indicators.map do |indicator|
              quant = Quant.find_by(name: indicator[:backend_name])
              raise "Missing #{indicator[:backend_name]} Quant necessary to calculate sustainability indicators for actor profile" unless quant.present?
              {name: indicator.key?(:name) ? indicator[:name] : quant.frontend_name, unit: quant.unit}
            end,
      rows: rows
    }
  end

  def helper
    @helper ||= Class.new do
      include ActionView::Helpers::NumberHelper
    end.new
  end
end
