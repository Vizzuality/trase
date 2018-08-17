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
    profiles = context.profiles.where(name: 'actor')
  end

  def initialise_place_profiles(context)
    profile = context.profiles.where(name: 'place').first
    create_trajectory_deforestation(profile)
  end

  def create_trajectory_deforestation(profile)
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
    chart = find_or_create_chart(profile, :trajectory_deforestation, 1)
    create_chart_attributes_from_attributes_list(chart, attributes_list)
  end

  def find_or_create_chart(profile, identifier, position)
    chart = Api::V3::Chart.
      includes(profile: :context_node_type).
      where(
        'profiles.name' => profile.name,
        'context_node_types.context_id' => profile.context_node_type.context_id,
        identifier: identifier
      ).first
    return chart if chart.present?
    Api::V3::Chart.create(
      profile: profile,
      position: position,
      identifier: identifier,
      title: 'Deforestation trajectory of %{place}'
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
    attribute_type = attribute_hash.delete(:attribute_type)
    attribute_name = attribute_hash.delete(:attribute_name)
    chart_attribute = Api::V3::ChartAttribute.new(
      chart: chart,
      position: position,
      display_name: attribute_hash[:name],
      legend_name: attribute_hash[:legend_name],
      display_type: attribute_hash[:type],
      display_style: attribute_hash[:style],
      state_average: attribute_hash[:state_average] || false
    )
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
