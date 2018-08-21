namespace :charts do
  desc 'Populate charts tables with profiles configuration for Brazil soy'
  task populate: :environment do
    context = Api::V3::Context.
      joins(:commodity, :country).
      find_by('countries.iso2' => 'BR', 'commodities.name' => 'SOY')
    exit(1) unless context.present?

    initialise_actor_profiles(context)
    initialise_place_profiles(context)
    Api::V3::Readonly::ChartAttribute.refresh
  end

  def initialise_actor_profiles(context)
    context.profiles.where(name: 'actor').each do |profile|
      create_sustainability(profile)
      create_companies_sourcing(profile)
    end
  end

  def initialise_place_profiles(context)
    context.profiles.where(name: 'place').each do |profile|
      create_environmental_indicators(profile)
      create_socioeconomic_indicators(profile)
      create_agricultural_indicators(profile)
      create_territorial_governance(profile)
      create_trajectory_deforestation(profile)
    end
  end

  def create_sustainability(profile)
    chart = find_or_create_chart(
      profile,
      :sustainability,
      position: 2,
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
  end

  def create_companies_sourcing(profile)
    chart = find_or_create_chart(
      profile,
      :companies_sourcing,
      position: 3, title: 'Comparing companies'
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

  def create_environmental_indicators(profile)
    chart = find_or_create_chart(
      profile,
      :environmental_indicators,
      position: 0, title: 'Environmental indicators'
    )
    attributes_list = [
      {attribute_type: 'quant', attribute_name: 'DEFORESTATION_V2'},
      {
        attribute_type: 'quant',
        attribute_name: 'POTENTIAL_SOY_DEFORESTATION_V2'
      },
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

  def create_socioeconomic_indicators(profile)
    chart = find_or_create_chart(
      profile,
      :socioeconomic_indicators,
      position: 0, title: 'Socio-economic indicators'
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

  def create_agricultural_indicators(profile)
    chart = find_or_create_chart(
      profile,
      :agricultural_indicators,
      position: 0, title: 'Agricultural indicators'
    )
    attributes_list = [
      {attribute_type: 'quant', attribute_name: 'SOY_TN'},
      {attribute_type: 'ind', attribute_name: 'SOY_YIELD'},
      {attribute_type: 'ind', attribute_name: 'SOY_AREAPERC'}
    ]
    create_chart_attributes_from_attributes_list(chart, attributes_list)
  end

  def create_territorial_governance(profile)
    chart = find_or_create_chart(
      profile,
      :territorial_governance,
      position: 0, title: 'Territorial governance'
    )
    attributes_list = [
      {attribute_type: 'quant', attribute_name: 'APP_DEFICIT_AREA'},
      {attribute_type: 'quant', attribute_name: 'LR_DEFICIT_AREA'},
      {attribute_type: 'ind', attribute_name: 'PROTECTED_DEFICIT_PERC'},
      {attribute_type: 'quant', attribute_name: 'EMBARGOES_'}
    ]
    create_chart_attributes_from_attributes_list(chart, attributes_list)
  end

  def create_trajectory_deforestation(profile)
    chart = find_or_create_chart(
      profile,
      :trajectory_deforestation,
      position: 1, title: 'Deforestation trajectory of %{place}'
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

  def find_or_create_chart(profile, identifier, options)
    chart = Api::V3::Chart.where(
      profile_id: profile.id,
      identifier: identifier
    ).first
    return chart if chart.present?
    Api::V3::Chart.create(
      profile: profile,
      identifier: identifier,
      position: options[:position],
      title: options[:title]
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
      position: position,
      display_name: attribute_hash[:name],
      legend_name: attribute_hash[:legend_name],
      display_type: attribute_hash[:type],
      display_style: attribute_hash[:style],
      state_average: attribute_hash[:state_average] || false
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
end
