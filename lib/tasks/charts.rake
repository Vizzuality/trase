namespace :charts do
  def without_chart_callbacks
    Api::V3::Chart.skip_callback(:commit, :after, :refresh_dependencies)
    Api::V3::ChartAttribute.skip_callback(:commit, :after, :refresh_dependencies)
    yield
    Api::V3::Chart.set_callback(:commit, :after, :refresh_dependencies)
    Api::V3::ChartAttribute.set_callback(:commit, :after, :refresh_dependencies)
  end

  task reload: :environment do
    without_chart_callbacks do
      Api::V3::ChartNodeType.delete_all
      Api::V3::ChartAttribute.delete_all
      Api::V3::Chart.delete_all
    end
    Rake::Task['charts:populate'].invoke
  end

  desc 'Populate charts tables with profiles configuration for Brazil soy'
  task populate: :environment do
    without_chart_callbacks do
      context = Api::V3::Context.
        joins(:commodity, :country).
        find_by('countries.iso2' => 'BR', 'commodities.name' => 'SOY')
      exit(1) unless context.present?

      initialise_actor_profiles(context)
      initialise_place_profiles(context)
      Api::V3::Readonly::ChartAttribute.refresh
    end
  end

  def initialise_actor_profiles(context)
    context.profiles.where(name: 'actor').each do |profile|
      create_actor_basic_attributes(profile)
      create_actor_top_countries(profile)
      create_actor_top_sources(profile)
      create_actor_sustainability_table(profile)
      create_actor_exporting_companies(profile)
    end
  end

  def initialise_place_profiles(context)
    context.profiles.where(name: 'place').each do |profile|
      chart = create_place_indicators_table(profile)
      create_place_basic_attributes(profile)
      create_place_environmental_indicators(profile, chart)
      create_place_socioeconomic_indicators(profile, chart)
      create_place_agricultural_indicators(profile, chart)
      create_place_territorial_governance(profile, chart)
      create_place_trajectory_deforestation(profile)
      create_place_top_consumer_actors(profile)
      create_place_top_consumer_countries(profile)
    end
  end

  def create_actor_basic_attributes(profile)
    chart = find_or_create_chart(
      profile,
      nil,
      :actor_basic_attributes,
      position: 0,
      title: 'Basic attributes'
    )
    node_types_list = [
      {
        name: NodeTypeName::MUNICIPALITY,
        identifier: :source
      },
      {
        name: NodeTypeName::COUNTRY,
        identifier: :destination
      }
    ]
    create_chart_node_types_from_node_types_list(chart, node_types_list)
  end

  def create_actor_top_countries(profile)
    chart = find_or_create_chart(
      profile,
      nil,
      :actor_top_countries,
      position: 1,
      title: 'Top destinations'
    )
    attributes_list = [
      {
        attribute_type: 'quant',
        attribute_name: 'SOY_TN',
        identifier: :commodity_production
      }
    ]
    create_chart_attributes_from_attributes_list(chart, attributes_list)
    node_types_list = [
      {
        name: NodeTypeName::COUNTRY,
        identifier: :destination
      }
    ]
    create_chart_node_types_from_node_types_list(chart, node_types_list)
  end

  def create_actor_top_sources(profile)
    chart = find_or_create_chart(
      profile,
      nil,
      :actor_top_sources,
      position: 2,
      title: 'Top sourcing regions'
    )
    attributes_list = [
      {
        attribute_type: 'quant',
        attribute_name: 'SOY_TN',
        identifier: :commodity_production
      }
    ]
    create_chart_attributes_from_attributes_list(chart, attributes_list)

    node_types_list = [
      {
        name: NodeTypeName::BIOME,
        identifier: :source,
        position: 0
      },
      {
        name: NodeTypeName::STATE,
        identifier: :source,
        position: 1
      },
      {
        name: NodeTypeName::MUNICIPALITY,
        identifier: :source,
        position: 2
      }
    ]
    create_chart_node_types_from_node_types_list(chart, node_types_list)
  end

  def create_actor_sustainability_table(profile)
    chart = find_or_create_chart(
      profile,
      nil,
      :actor_sustainability_table,
      position: 3,
      title: 'Deforestation risk associated with top sourcing regions'
    )
    attributes_list = [
      {
        attribute_type: 'quant',
        attribute_name: 'DEFORESTATION_V2'
      },
      {
        name: 'Soy deforestation',
        attribute_type: 'quant',
        attribute_name: 'SOY_DEFORESTATION_5_YEAR_ANNUAL'
      }
    ]
    create_chart_attributes_from_attributes_list(chart, attributes_list)

    node_types_list = [
      {
        name: NodeTypeName::MUNICIPALITY,
        identifier: :source,
        position: 0
      },
      {
        name: NodeTypeName::BIOME,
        identifier: :source,
        position: 1,
        is_total: true
      }
    ]
    create_chart_node_types_from_node_types_list(chart, node_types_list)
  end

  def create_actor_exporting_companies(profile)
    chart = find_or_create_chart(
      profile,
      nil,
      :actor_exporting_companies,
      position: 4,
      title: 'Comparing companies'
    )
    attributes_list = [
      {
        name: 'Land use',
        unit: 'ha',
        attribute_type: 'quant',
        attribute_name: 'SOY_AREA_'
      },
      {
        name: 'Territorial Deforestation',
        unit: 'ha',
        attribute_type: 'quant',
        attribute_name: 'DEFORESTATION_V2'
      },
      {
        name: 'Soy deforestation',
        unit: 'ha',
        attribute_type: 'quant',
        attribute_name: 'SOY_DEFORESTATION_5_YEAR_ANNUAL'
      }
    ]
    create_chart_attributes_from_attributes_list(chart, attributes_list)
  end

  def create_place_basic_attributes(profile)
    chart = find_or_create_chart(
      profile,
      nil,
      :place_basic_attributes,
      position: 0,
      title: 'Basic attributes'
    )

    attributes_list = [
      {
        attribute_type: 'quant',
        attribute_name: 'AREA_KM2',
        identifier: :area
      },
      {
        attribute_type: 'ind',
        attribute_name: 'SOY_AREAPERC',
        identifier: :commodity_farmland
      },
      {
        attribute_type: 'quant',
        attribute_name: 'SOY_TN',
        identifier: :commodity_production
      },
      {
        attribute_type: 'ind',
        attribute_name: 'SOY_YIELD',
        identifier: :commodity_yield
      }
    ]
    create_chart_attributes_from_attributes_list(chart, attributes_list)

    node_types_list = [
      {
        name: NodeTypeName::MUNICIPALITY,
        identifier: :summary,
        position: 0
      },
      {
        name: NodeTypeName::LOGISTICS_HUB,
        identifier: :summary,
        position: 1
      }
    ]
    create_chart_node_types_from_node_types_list(chart, node_types_list)
  end

  def create_place_indicators_table(profile)
    chart = find_or_create_chart(
      profile,
      nil,
      :place_indicators_table,
      position: 1,
      title: 'Sustainability indicators'
    )
    create_chart_attributes_from_attributes_list(chart, [])
    chart
  end

  def create_place_environmental_indicators(profile, parent)
    chart = find_or_create_chart(
      profile,
      parent,
      :place_environmental_indicators,
      position: 0,
      title: 'Environmental indicators'
    )
    attributes_list = [
      {attribute_type: 'quant', attribute_name: 'DEFORESTATION_V2'},
      {
        attribute_type: 'quant',
        attribute_name: 'AGROSATELITE_SOY_DEFOR_'
      },
      {attribute_type: 'quant', attribute_name: 'GHG_'},
      {attribute_type: 'ind', attribute_name: 'WATER_SCARCITY'},
      {attribute_type: 'quant', attribute_name: 'BIODIVERSITY'}
    ]
    create_chart_attributes_from_attributes_list(chart, attributes_list)
  end

  def create_place_socioeconomic_indicators(profile, parent)
    chart = find_or_create_chart(
      profile,
      parent,
      :place_socioeconomic_indicators,
      position: 1,
      title: 'Socio-economic indicators'
    )
    attributes_list = [
      {attribute_type: 'ind', attribute_name: 'HDI'},
      {attribute_type: 'ind', attribute_name: 'GDP_CAP'},
      {attribute_type: 'ind', attribute_name: 'PERC_FARM_GDP_'},
      {attribute_type: 'ind', attribute_name: 'SMALLHOLDERS'},
      {attribute_type: 'quant', attribute_name: 'SLAVERY'},
      {attribute_type: 'quant', attribute_name: 'LAND_CONFL'},
      {attribute_type: 'quant', attribute_name: 'POPULATION'}
    ]
    create_chart_attributes_from_attributes_list(chart, attributes_list)
  end

  def create_place_agricultural_indicators(profile, parent)
    chart = find_or_create_chart(
      profile,
      parent,
      :place_agricultural_indicators,
      position: 2,
      title: 'Agricultural indicators'
    )
    attributes_list = [
      {attribute_type: 'quant', attribute_name: 'SOY_TN'},
      {attribute_type: 'ind', attribute_name: 'SOY_YIELD'},
      {attribute_type: 'ind', attribute_name: 'SOY_AREAPERC'}
    ]
    create_chart_attributes_from_attributes_list(chart, attributes_list)
  end

  def create_place_territorial_governance(profile, parent)
    chart = find_or_create_chart(
      profile,
      parent,
      :place_territorial_governance,
      position: 3,
      title: 'Territorial governance'
    )
    attributes_list = [
      {attribute_type: 'quant', attribute_name: 'APP_DEFICIT_AREA'},
      {attribute_type: 'quant', attribute_name: 'LR_DEFICIT_AREA'},
      {attribute_type: 'ind', attribute_name: 'PROTECTED_DEFICIT_PERC'},
      {attribute_type: 'quant', attribute_name: 'EMBARGOES_'}
    ]
    create_chart_attributes_from_attributes_list(chart, attributes_list)
  end

  def create_place_trajectory_deforestation(profile)
    chart = find_or_create_chart(
      profile,
      nil,
      :place_trajectory_deforestation,
      position: 2,
      title: 'Deforestation trajectory of %{place}'
    )
    attributes_list = [
      {
        name: 'Soy deforestation',
        attribute_type: 'quant',
        attribute_name: 'AGROSATELITE_SOY_DEFOR_',
        legend_name: 'Soy deforestation',
        type: 'area',
        style: 'area-pink'
      },
      {
        name: 'Territorial Deforestation',
        attribute_type: 'quant',
        attribute_name: 'DEFORESTATION_V2',
        legend_name: 'Territorial<br/>Deforestation',
        type: 'area',
        style: 'area-black'
      },
      {
        name: 'State Average',
        attribute_type: 'quant',
        attribute_name: 'DEFORESTATION_V2',
        legend_name: 'State<br/>Average',
        type: 'line',
        style: 'line-dashed-black',
        state_average: true
      }
    ]
    create_chart_attributes_from_attributes_list(chart, attributes_list)
  end

  def create_place_top_consumer_actors(profile)
    chart = find_or_create_chart(
      profile,
      nil,
      :place_top_consumer_actors,
      position: 3,
      title: 'Top traders'
    )

    node_types_list = [
      {
        name: NodeTypeName::EXPORTER,
        identifier: :trader
      }
    ]
    create_chart_node_types_from_node_types_list(chart, node_types_list)
  end

  def create_place_top_consumer_countries(profile)
    chart = find_or_create_chart(
      profile,
      nil,
      :place_top_consumer_countries,
      position: 4,
      title: 'Top importer countries'
    )

    node_types_list = [
      {
        name: NodeTypeName::COUNTRY,
        identifier: :destination
      }
    ]
    create_chart_node_types_from_node_types_list(chart, node_types_list)
  end

  def find_or_create_chart(profile, parent, identifier, options)
    chart = Api::V3::Chart.where(
      profile_id: profile.id,
      parent_id: parent&.id,
      identifier: identifier
    ).first
    return chart if chart.present?

    Api::V3::Chart.create(
      profile: profile,
      parent: parent,
      identifier: identifier,
      position: options[:position],
      title: options[:title],
      options: options[:options]
    )
  end

  def create_chart_attributes_from_attributes_list(chart, list)
    chart.chart_attributes.delete_all
    list.each_with_index do |attribute_hash, idx|
      create_chart_attribute(chart, attribute_hash, idx)
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def create_chart_attribute(chart, attribute_hash, position)
    chart_attribute = Api::V3::ChartAttribute.new(
      chart: chart,
      position: attribute_hash[:identifier].present? ? nil : position,
      display_name: attribute_hash[:name],
      legend_name: attribute_hash[:legend_name],
      display_type: attribute_hash[:type],
      display_style: attribute_hash[:style],
      state_average: attribute_hash[:state_average] || false,
      identifier: attribute_hash[:identifier]
    )
    attribute_type = attribute_hash.delete(:attribute_type)
    attribute_name = attribute_hash.delete(:attribute_name)
    linked_attribute =
      case attribute_type
      when 'ind'
        ind = Api::V3::Ind.find_by_name(attribute_name)
        chart_attribute.build_chart_ind(ind: ind) if ind
      when 'qual'
        qual = Api::V3::Qual.find_by_name(attribute_name)
        chart_attribute.build_chart_qual(qual: qual) if qual
      when 'quant'
        quant = Api::V3::Quant.find_by_name(attribute_name)
        chart_attribute.build_chart_quant(quant: quant) if quant
      end
    return nil unless linked_attribute

    chart_attribute.save
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def create_chart_node_types_from_node_types_list(chart, list)
    chart.chart_node_types.delete_all
    list.each do |node_type_hash|
      node_type = Api::V3::NodeType.find_by_name(node_type_hash[:name])
      next unless node_type

      chart.chart_node_types.create(
        node_type: node_type,
        identifier: node_type_hash[:identifier],
        position: node_type_hash[:position],
        is_total: node_type_hash[:is_total]
      )
    end
  end
end
