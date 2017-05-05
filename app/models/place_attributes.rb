class PlaceAttributes

  def initialize(context, year, node)
    @context = context
    @year = year
    @node = node
    @node_type = @node.node_type.node_type

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
    ([@node] + @node.ancestors.to_a).each do |node|
      @data[(node.node_type.node_type.downcase + '_name').to_sym] = node.name
      @data[(node.node_type.node_type.downcase + '_geo_id').to_sym] = node.geo_id
    end

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
    # TODO this value is competely different from example - by order of magnitude (?)
    soy_area = if (area_perc = @place_inds['SOY_AREAPERC']) && (area = @place_quants['AREA_KM2'])
      value = helper.number_with_precision(area_perc['value'] * area['value'], {delimiter: ',', precision: 0})
      unit = 'Ha' # area is in km2
      "#{value}#{unit}"
    end
    percentage_farm = if (perc = @place_inds['PERC_FARM_GDP'])
      value = perc['value'].round
      unit = perc['unit']
      "#{value}#{unit}"
    end
    country_ranking = @stats.country_ranking(@context, 'quant', 'SOY_TN').ordinalize
    state_ranking = @stats.state_ranking(@state, 'quant', 'SOY_TN').ordinalize if @state.present?
    largest_exporter = (traders = @data[:top_traders][:actors]) && traders[0] && traders[0][:name]
    # might be unit incompatibility, percentage miniscule?
    percent_of_exports = helper.number_to_percentage(
      ((@data[:top_traders][:actors][0][:value] || 0) / soy_produced_raw) * 100, {precision: 0}
    ) if largest_exporter && soy_produced
    main_destination = (consumers = @data[:top_consumers][:countries]) && consumers[0] && consumers[0][:name]

    text = <<-EOT
In #{@year}, #{@node.name.humanize} produced #{soy_produced} of soy occupying a total of #{soy_area} \
of land. With #{percentage_farm} of the total production, it ranks #{country_ranking} in Brazil in soy \
production, and #{state_ranking} in the state of Mato Grosso. The largest exporter of soy \
in #{@node.name.humanize} was #{largest_exporter.humanize}, which accounted for #{percent_of_exports} of the total exports, \
and the main destination was #{main_destination.humanize}.
EOT
  end

  def municipality_and_logistics_hub_extra_data
    data = {}

    biome_name = @place_quals[NodeTypeName::BIOME]['value']
    biome = Node.biomes.find_by_name(biome_name)
    data[:biome_name] = biome_name
    data[:biome_geo_id] = biome.try(:geo_id)
    state_name = @place_quals[NodeTypeName::STATE]['value']
    @state = Node.states.find_by_name(state_name)
    data[:state_name] = state_name
    data[:state_geo_id] = @state.try(:geo_id)
    if @place_quants['AREA_KM2'].present?
      data[:area] = @place_quants['AREA_KM2']['value']
    end
    if @place_inds['SOY_AREAPERC'].present?
      data[:soy_farmland] = @place_inds['SOY_AREAPERC']['value']
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
      {type: 'ind', backend_name: 'PERC_INDIGENOUS'},
      {type: 'ind', backend_name: 'PERC_PROTECTED'},
      {type: 'quant', backend_name: 'EMBARGOES_'},
      {type: 'ind', backend_name: 'COMPLIANCE_FOREST_CODE'},
      {type: 'quant', backend_name: 'PROTECTED'}
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
    indicators_list = [
      {name: 'Potential Soy related deforestation', type: 'ind', backend_name: 'POTENTIAL_SOY_RELATED_DEFOR_ind'},
      {name: 'Territorial Deforestation', type: 'ind', backend_name: 'TOTAL_DEFOR_RATE'}
    ]
    min_year, max_year = nil, nil
    indicators_list.each do |i|
      min_max = if i[:type] == 'quant'
        @node.temporal_place_quants.where('quants.name' => i[:backend_name])
      elsif i[:type] == 'ind'
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
        lines: indicators_list.map do |i|
          data = if i[:type] == 'quant'
            @node.temporal_place_quants.where('quants.name' => i[:backend_name])
          elsif i[:type] == 'ind'
            @node.temporal_place_inds.where('inds.name' => i[:backend_name])
          end
          values = Hash[data.map do |e|
            [e['year'], e]
          end]
          {
            name: i[:name],
            values: years.map{ |y| values[y] && values[y]['value'] }
          }
        end
      }
    }
  end

  private

  def top_nodes_summary(node_type, node_list_label)
    top_nodes = FlowStatsForNode.new(@context, @year, @node, node_type).top_volume_nodes
    node_value_sum = top_nodes.map{ |t| t[:value] }.reduce(0, :+)

    {
      node_list_label => top_nodes.map{ |t| {id: t['node_id'], name: t['name'], value: t['value']/node_value_sum} },
      matrix: [
        [0] + top_nodes.map{ |t| t['value'] },
        *top_nodes.map{ |t| [t['value']] + Array.new((top_nodes.size - 1), 0) }
      ]
    }
  end

  def indicators_group(list, name)
    # fetch frontend names and units
    list.each do |indicator|
      i = indicator[:type].camelize.constantize.find_by_name(indicator[:backend_name])
      if i.nil?
        Rails.logger.debug "NOT FOUND " + indicator[:backend_name]
        next
      end
      indicator[:name] = i.frontend_name
      indicator[:unit] = i.unit
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
