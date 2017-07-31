class PlaceAttributes

  def initialize(context, year, node)
    @context = context
    @year = year
    @node = node
    @node_type = @node.node_type.node_type

    return if @node.is_unknown? or @node.is_domestic_consumption?

    @stats = FlowStatsForNode.new(@context, @year, @node, @node_type)

    @place_quals = Hash[(@node.place_quals + @node.temporal_place_quals(@year)).map do |e|
      [e['name'], e]
    end]
    @place_quants = Hash[(@node.place_quants + @node.temporal_place_quants(@year)).map do |e|
      [e['name'], e]
    end]
    @place_inds = Hash[(@node.place_inds + @node.temporal_place_inds(@year)).map do |e|
      [e['name'], e]
    end]

    @data = {
      column_name: @node_type,
      country_name: @context.country.name,
      country_geo_id: @context.country.iso2
    }
    @data[(@node.node_type.node_type.downcase + '_name').to_sym] = @node.name
    @data[(@node.node_type.node_type.downcase + '_geo_id').to_sym] = @node.geo_id

    if [NodeTypeName::MUNICIPALITY, NodeTypeName::LOGISTICS_HUB].include? @node_type
      @data = @data.merge(municipality_and_logistics_hub_extra_data)
    end

    @data = @data.merge(top_traders)
    @data = @data.merge(top_consumers)
    @data = @data.merge(indicators)
    @data = @data.merge(trajectory_deforestation)

    @data[:summary] = summary
  end

  def result
    {
      data: @data
    }
  end

  def summary
    soy_produced_raw, soy_produced = if (production = @place_quants['SOY_TN'])
      value = helper.number_with_precision(production['value'], {delimiter: ',', precision: 0})
      unit = production['unit']
      [production['value'], "#{value}#{unit}"]
    end
    # TODO this value is completely different from example - by order of magnitude (?)
    soy_area = if (area_perc = @place_inds['SOY_AREAPERC']) && (area = @place_quants['AREA_KM2'])
      # SOY_AREA_PERC is not given as decimal, therefore we should divide it by 100;
      # however, to convert to hectars we should multiply the result by 100.
      # Therefore, both those operations can be skipped.
      value = helper.number_with_precision(area_perc['value'] * area['value'], {delimiter: ',', precision: 0})
      unit = 'Ha' # area is in km2
      "#{value}#{unit}"
    end
    perc_total = total_soy_production()
    percentage_total_production = if (perc = @place_quants['SOY_TN'])
      helper.number_to_percentage((perc['value'] / perc_total) * 100, {delimiter: ',', precision: 2})
    end
    country_ranking = @stats.country_ranking(@context, 'quant', 'SOY_TN')
    country_ranking = country_ranking.ordinalize if country_ranking.present?
    state_ranking = @stats.state_ranking(@state, 'quant', 'SOY_TN') if @state.present?
    state_ranking = state_ranking.ordinalize if state_ranking.present?

    largest_exporter = (traders = top_municipality_exporters()) && traders[:actors][0]
    if largest_exporter.present?
      largest_exporter_name = largest_exporter[:name].try(:humanize)
      percent_of_exports = helper.number_to_percentage(
        (largest_exporter[:value] || 0) * 100,
        {delimiter: ',', precision: 1}
      )
    end

    main_destination = (consumers = @data[:top_consumers][:countries]) && consumers[0] && consumers[0][:name]
    main_destination = main_destination.humanize if main_destination.present?

    text = <<-EOT
In #{@year}, #{@node.name.humanize} produced #{soy_produced} of soy occupying a total of #{soy_area} \
of land. With #{percentage_total_production} of the total production, it ranks #{country_ranking} in Brazil in soy \
production, and #{state_ranking} in the state of Mato Grosso. The largest exporter of soy \
in #{@node.name.humanize} was #{largest_exporter_name}, which accounted for #{percent_of_exports} of the total exports, \
and the main destination was #{main_destination}.
EOT
  end

  def municipality_and_logistics_hub_extra_data
    data = {}

    biome_name = @place_quals[NodeTypeName::BIOME] && @place_quals[NodeTypeName::BIOME]['value']
    biome = Node.biomes.find_by_name(biome_name)
    data[:biome_name] = biome_name
    data[:biome_geo_id] = biome.try(:geo_id)
    state_name = @place_quals[NodeTypeName::STATE] && @place_quals[NodeTypeName::STATE]['value']
    @state = Node.states.find_by_name(state_name)
    data[:state_name] = state_name
    data[:state_geo_id] = @state.try(:geo_id)
    if @place_quants['AREA_KM2'].present?
      data[:area] = @place_quants['AREA_KM2']['value']
    end
    if @place_inds['SOY_AREAPERC'].present?
      data[:soy_farmland] = @place_inds['SOY_AREAPERC']['value'] / 100
    end
    if @place_quants['SOY_TN'].present?
      data[:soy_production] = @place_quants['SOY_TN']['value']
    end
    data
  end

  def top_traders
    {
      top_traders: top_nodes_summary(NodeTypeName::EXPORTER, :actors)
    }
  end

  def top_consumers
    {
      top_consumers: top_nodes_summary(NodeTypeName::COUNTRY, :countries)
    }
  end

  def indicators
    {
      indicators: [
        sustainability_indicators,
        deforestation_indicators,
        other_indicators,
        socioeconomic_indicators
      ]
    }
  end

  def sustainability_indicators
    indicators_list = [
      {type: 'ind', backend_name: 'WATER_SCARCITY'},
      {type: 'quant', backend_name: 'FIRE_KM2_'},
      {type: 'quant', backend_name: 'GHG_'}
    ]

    indicators_group(indicators_list, 'Key sustainability indicators')
  end

  def deforestation_indicators
    indicators_list = [
      {type: 'quant', backend_name: 'AGROSATELITE_SOY_DEFOR_'},
      {type: 'ind', backend_name: 'TOTAL_DEFOR_RATE'}
    ]

    indicators_group(indicators_list, 'Deforestation')
  end

  def other_indicators
    indicators_list = [
      {type: 'quant', backend_name: 'BIODIVERSITY'},
      {type: 'ind', backend_name: 'PERC_INDIGENOUS'}, # NO MATCH
      {type: 'ind', backend_name: 'PERC_PROTECTED'}, # NO MATCH
      {type: 'quant', backend_name: 'EMBARGOES_'},
      {type: 'ind', backend_name: 'PROTECTED_DEFICIT_PERC'},
      {type: 'quant', backend_name: 'PROTECTED'} # NO MATCH
    ]

    indicators_group(indicators_list, 'Other environmental indicators')
  end

  def socioeconomic_indicators
    indicators_list = [
      {type: 'ind', backend_name: 'GDP_CAP'},
      {type: 'ind', backend_name: 'HDI'},
      {type: 'ind', backend_name: 'PERC_FARM_GDP'},
      {type: 'ind', backend_name: 'SMALLHOLDERS'},
      {type: 'quant', backend_name: 'CATTLE_HEADS'},
      {type: 'quant', backend_name: 'LAND_CONFL'},
      {type: 'quant', backend_name: 'POPULATION'},
      {type: 'quant', backend_name: 'SLAVERY'},
      {type: 'quant', backend_name: 'SOY_TN'}
    ]

    indicators_group(indicators_list, 'Socio-economic indicators')
  end

  def trajectory_deforestation
    unless @node_type == NodeTypeName::MUNICIPALITY
      return {
        trajectory_deforestation: nil
      }
    end
    indicators_list = [
      {
        name: 'Soy related deforestation',
        indicator_type: 'quant',
        backend_name: 'AGROSATELITE_SOY_DEFOR_',
        legend_name: 'Soy related<br/>deforestation',
        type: 'area',
        style: 'area-pink'
      },
      {
        name: 'Potential Soy related deforestation',
        indicator_type: 'ind',
        backend_name: 'POTENTIAL_SOY_RELATED_DEFOR_ind',
        legend_name: 'Potential Soy<br/>related deforestation',
        type: 'line',
        style: 'line-dashed-pink'
      },
      {
        name: 'Territorial Deforestation',
        indicator_type: 'ind',
        backend_name: 'TOTAL_DEFOR_RATE',
        legend_name: 'Territorial<br/>Deforestation',
        type: 'area',
        style: 'area-black'
      },
      {
        name: 'State Average',
        indicator_type: 'ind',
        backend_name: 'TOTAL_DEFOR_RATE',
        legend_name: 'State<br/>Average',
        type: 'line',
        style: 'line-dashed-black',
        state_average: true
      }
    ]
    min_year, max_year = nil, nil
    indicators_list.each do |i|
      min_max = if i[:indicator_type] == 'quant'
        @node.temporal_place_quants.where('quants.name' => i[:backend_name])
      elsif i[:indicator_type] == 'ind'
        @node.temporal_place_inds.where('inds.name' => i[:backend_name])
      end.except(:select).select('MIN(year), MAX(year)').first
      if min_max && min_max['min'].present? && (min_year.nil? || min_max['min'] < min_year)
        min_year = min_max['min']
      end
      if min_max && min_max['max'].present? && (max_year.nil? || min_max['max'] > max_year)
        max_year = min_max['max']
      end
    end

    years = (min_year..max_year).to_a
    {
      trajectory_deforestation: {
        included_years: years,
        unit: 'Ha',
        lines: indicators_list.map do |i|
          data = if i[:state_average] && @state.present?
            @stats.state_average(@state, i[:indicator_type], i[:backend_name])
          else
            if i[:indicator_type] == 'quant'
              @node.temporal_place_quants.where('quants.name' => i[:backend_name])
            elsif i[:indicator_type] == 'ind'
              @node.temporal_place_inds.where('inds.name' => i[:backend_name])
            end
          end
          values = Hash[data.map do |e|
            [e['year'], e]
          end]
          {
            name: i[:name],
            legend_name: i[:legend_name],
            type: i[:type],
            style: i[:style],
            values: years.map{ |y| values[y] && values[y]['value'] }
          }
        end
      }
    }
  end

  private

  def total_soy_production
    NodeQuant.
        joins(:quant).
        where('quants.name' => 'SOY_TN', :year => 2015).
        sum(:value)
  end

  def top_municipality_exporters
    top_nodes_summary(NodeTypeName::EXPORTER, :actors, false)
  end

  def top_nodes_summary(node_type, node_list_label, include_domestic_consumption = true)
    all_municipalities = @node.same_type_nodes_indicator_values('quant', 'SOY_TN').
      where('nodes.node_id <> ?', @node.id). # do not double count current
      select(
        'nodes.node_id',
        'nodes.name',
        'SUM(node_quants.value) AS value'
      ).
      where("node_quants.year" => @year).
      group('nodes.node_id, nodes.name').
      order('value desc')

    top_municipalities = [@node] + all_municipalities.limit(9).all
    top_municipalities_count = top_municipalities.length

    top_nodes = FlowStatsForNode.new(@context, @year, @node, node_type).top_nodes_for_quant('Volume', include_domestic_consumption)
    node_value_sum = top_nodes.map{ |t| t[:value] }.reduce(0, :+)
    matrix_size = top_municipalities_count + top_nodes.size
    matrix = Array.new(matrix_size){ Array.new(matrix_size){ 0 } }
    matrix[0] = top_municipalities.map { 0 } + top_nodes.map{ |t| t['value'] }

    top_municipalities.each_with_index do |municipality, m_idx|
      all_nodes = FlowStatsForNode.new(@context, @year, municipality, node_type).all_nodes_for_quant('Volume')
      top_nodes.each_with_index do |t, t_idx|
        n = all_nodes.find{ |e| e['node_id'] == t['node_id'] }
        value = n && n['value']
        matrix[m_idx][top_municipalities_count + t_idx] = value
        matrix[top_municipalities_count + t_idx][m_idx] = value
      end
    end

    result = {
      node_list_label =>
        top_nodes.map{ |t| {id: t['node_id'], name: t['name'], value: t['value']/node_value_sum, is_domestic_consumption: t['is_domestic_consumption']} },
      municipalities: top_municipalities.map{ |m| {id: m.id, name: m.name} },
      matrix: matrix
    }
  end

  def indicators_group(list, name)
    # fetch frontend names and units
    list = list.select do |indicator|
      i = indicator[:type].camelize.constantize.find_by_name(indicator[:backend_name])
      if i.nil?
        Rails.logger.debug "NOT FOUND " + indicator[:backend_name]
        false
      else
        indicator[:name] = i.frontend_name
        indicator[:unit] = i.unit
        indicator
      end
    end
    included_columns = list.map{ |i| i.slice(:name, :unit)}
    values = []
    ranking_scores = []
    list.each do |indicator|
      values <<
        if indicator[:type] == 'quant' && @place_quants[indicator[:backend_name]].present?
          @place_quants[indicator[:backend_name]]['value']
        elsif indicator[:type] == 'ind' && @place_inds[indicator[:backend_name]].present?
          @place_inds[indicator[:backend_name]]['value']
        else
          nil
        end
      if @state.present?
        ranking_scores << @stats.state_ranking(@state, indicator[:type], indicator[:backend_name])
      end
    end
    {
      name: name,
      included_columns: included_columns,
      rows: [
        {
          name: 'Score',
          have_unit: true,
          values: values
        },
        {
          name: 'State Ranking',
          have_unit: false,
          values: ranking_scores
        }
      ]
    }
  end

  def helper
    @helper ||= Class.new do
      include ActionView::Helpers::NumberHelper
    end.new
  end

end
