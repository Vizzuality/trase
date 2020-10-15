namespace :charts do
  def without_chart_callbacks
    Api::V3::RefreshDependencies.instance.classes_with_dependents.each do |class_with_dependents|
      class_with_dependents.skip_callback(:create, :after, :refresh_dependents_after_create)
      class_with_dependents.skip_callback(:update, :after, :refresh_dependents_after_update)
      class_with_dependents.skip_callback(:destroy, :after, :refresh_dependents_after_destroy)
    end

    yield

    Api::V3::RefreshDependencies.instance.classes_with_dependents.each do |class_with_dependents|
      class_with_dependents.set_callback(:create, :after, :refresh_dependents_after_create)
      class_with_dependents.set_callback(:update, :after, :refresh_dependents_after_update)
      class_with_dependents.set_callback(:destroy, :after, :refresh_dependents_after_destroy)
    end
  end

  task reload: :environment do
    without_chart_callbacks do
      Api::V3::ChartNodeType.delete_all
      Api::V3::ChartAttribute.delete_all
      Api::V3::Chart.delete_all
      Api::V3::Profile.delete_all
    end
    Rake::Task['charts:populate'].invoke
  end

  desc 'Populate charts tables with profiles configuration for Brazil soy'
  task populate: :environment do
    Dir["#{Rails.root}/config/charts/*.yml"].each do |config_file_path|
      load_charts(config_file_path)
    end
  end

  # rubocop:disable Metrics/AbcSize
  def load_charts(config_file_path)
    without_chart_callbacks do
      config = YAML.safe_load(File.open(config_file_path))
      context = Api::V3::Context.
        joins(:commodity, :country).
        find_by(
          'countries.iso2' => config['country'],
          'commodities.name' => config['commodity']
        )
      unless context
        raise "Context not found #{config['country']} / #{config['commodity']}"
      end

      config['profiles'].each do |profile_config|
        context_node_type = context.context_node_types.
          includes(:node_type).
          where('node_types.name' => profile_config['node_type']).
          first
        unless context_node_type
          raise "Context node type not found #{profile_config['node_type']}"
        end

        profile = context.profiles.where(
          context_node_type_id: context_node_type.id,
          name: profile_config['type']
        ).first

        unless profile
          Api::V3::Profile.create(
            context_node_type: context_node_type,
            name: profile_config['type'],
            main_topojson_path: profile_config['main_topojson_path'],
            main_topojson_root: profile_config['main_topojson_root'],
            adm_1_name: profile_config['adm_1_name'],
            adm_1_topojson_path: profile_config['adm_1_topojson_path'],
            adm_1_topojson_root: profile_config['adm_1_topojson_root'],
            adm_2_name: profile_config['adm_2_name'],
            adm_2_topojson_path: profile_config['adm_2_topojson_path'],
            adm_2_topojson_root: profile_config['adm_2_topojson_root']

          )
        end
      end
      # rubocop:enable Metrics/AbcSize

      config['charts'].each do |chart_config|
        context.profiles.where(name: chart_config['profile']).each do |profile|
          chart = find_or_create_chart(
            profile,
            chart_config['parent_identifier'],
            chart_config['identifier'],
            position: chart_config['position'],
            title: chart_config['title']
          )
          attributes_list = chart_config['attributes']
          if attributes_list
            create_chart_attributes_from_attributes_list(
              chart, attributes_list
            )
          end
          node_types_list = chart_config['node_types']
          next unless node_types_list

          create_chart_node_types_from_node_types_list(
            chart, node_types_list
          )
        end
      end
    end
  end

  def find_or_create_chart(profile, parent_identifier, identifier, options)
    parent = Api::V3::Chart.where(
      profile_id: profile.id,
      parent_id: nil,
      identifier: parent_identifier
    ).first
    chart = Api::V3::Chart.where(
      profile_id: profile.id,
      parent_id: parent&.id,
      identifier: identifier
    ).first

    return chart if chart.present?

    chart = Api::V3::Chart.new(
      profile: profile,
      parent: parent,
      identifier: identifier,
      position: options[:position],
      title: options[:title]
    )
    unless chart.valid?
      Api::V3::Chart.all.each do |chart|
        puts chart.inspect
      end
      puts profile.inspect
      puts profile.context_node_type.context.inspect
      puts chart.errors.inspect
      exit(1)
    end
    chart.save
    chart
  end

  def create_chart_attributes_from_attributes_list(chart, list)
    chart.chart_attributes.delete_all
    list.each.with_index do |attribute_hash, idx|
      create_chart_attribute(chart, attribute_hash, idx)
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def create_chart_attribute(chart, attribute_hash, idx)
    position = attribute_hash['position'] ||
      (attribute_hash['identifier'].present? ? nil : idx)
    chart_attribute = Api::V3::ChartAttribute.new(
      chart: chart,
      identifier: attribute_hash['identifier'],
      position: position,
      display_name: attribute_hash['name'],
      legend_name: attribute_hash['legend_name'],
      display_type: attribute_hash['type'],
      display_style: attribute_hash['style'],
      state_average: attribute_hash['state_average'] || false
    )
    attribute_type = attribute_hash['attribute_type']
    attribute_name = attribute_hash['attribute_name']
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
    list.each.with_index do |node_type_hash, idx|
      node_type = Api::V3::NodeType.find_by_name(node_type_hash['name'])
      next unless node_type

      position = node_type_hash['position'] ||
        (node_type_hash['identifier'].present? ? nil : idx)

      chart.chart_node_types.create(
        node_type: node_type,
        identifier: node_type_hash['identifier'],
        position: position,
        is_total: node_type_hash['is_total']
      )
    end
  end
end
