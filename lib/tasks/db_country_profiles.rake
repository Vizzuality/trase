namespace :db do
  namespace :country_profiles do
    desc 'Populate country profiles configuration'
    task populate: :environment do
      without_chart_callbacks do
        delete_charts_in_wrong_running_order
        populate_exporters
        populate_importers
      end

      Api::V3::Profile.new.refresh_dependents
    end

    EXPORTERS_RUNNING_ORDER = {
      country_basic_attributes: 0,
      country_commodity_exports: 1,
      country_trajectory_deforestation: 2,
      country_indicators: 3,
      country_top_consumer_actors: 4,
      country_top_consumer_countries: 5
    }.freeze
    IMPORTERS_RUNNING_ORDER = {
      country_basic_attributes: 0,
      country_commodity_imports: 1,
      country_trajectory_import: 2,
      country_top_consumer_actors: 3,
      country_top_consumer_countries: 4
    }.freeze

    def delete_charts_in_wrong_running_order
      charts = Api::V3::Chart.
        joins(profile: :context_node_type).
        where(
          parent_id: nil,
          'profiles.name' => Api::V3::Profile::COUNTRY,
          'context_node_types.node_type_id' => country_of_export_node_type.id
        )
      to_delete = charts.select { |chart| chart.position != EXPORTERS_RUNNING_ORDER[chart.identifier.to_sym] }
      to_delete.each(&:delete)

      charts = Api::V3::Chart.
        joins(profile: :context_node_type).
        where(
          parent_id: nil,
          'profiles.name' => Api::V3::Profile::COUNTRY,
          'context_node_types.node_type_id' => country_of_import_node_type.id
        )
      to_delete = charts.select { |chart| chart.position != IMPORTERS_RUNNING_ORDER[chart.identifier.to_sym] }
      to_delete.each(&:delete)
    end

    def populate_exporters
      exporter_context_node_types = Api::V3::ContextNodeType.where(
        node_type_id: country_of_export_node_type.id
      )
      exporter_context_node_types.each do |cnt|
        profile = find_or_create_profile(Api::V3::Profile::COUNTRY, cnt)
        populate_basic_attributes profile
        populate_commodity_exports profile
        populate_deforestation_trajectory profile
        populate_exporter_top_traders profile
        populate_exporter_top_countries profile
        populate_sustainability_indicators profile
      end
    end

    def populate_importers
      importer_context_node_types = Api::V3::ContextNodeType.where(
        node_type_id: country_of_import_node_type.id
      )

      importer_context_node_types.each do |cnt|
        profile = find_or_create_profile(Api::V3::Profile::COUNTRY, cnt)
        populate_basic_attributes profile
        populate_commodity_imports profile
        populate_import_trajectory profile
        populate_importer_top_traders profile
        populate_importer_top_countries profile
      end
    end

    def populate_basic_attributes(profile)
      find_or_create_chart(
        profile, nil, :country_basic_attributes, 0, 'Basic attributes'
      )
    end

    def populate_commodity_exports(profile)
      identifier = :country_commodity_exports
      position = EXPORTERS_RUNNING_ORDER[identifier]
      find_or_create_chart(
        profile, nil, identifier, position, 'Top exports in {{year}}'
      )
    end

    def populate_commodity_imports(profile)
      identifier = :country_commodity_imports
      position = IMPORTERS_RUNNING_ORDER[identifier]
      find_or_create_chart(
        profile, nil, identifier, position, 'Top imports in {{year}}'
      )
    end

    def populate_deforestation_trajectory(profile)
      identifier = :country_trajectory_deforestation
      position = EXPORTERS_RUNNING_ORDER[identifier]
      title = 'Deforestation trajectory of {{country_name}}'
      country_chart = find_or_create_chart(
        profile, nil, identifier, position, title
      )

      place_chart = place_chart(
        profile.context_node_type.context.country_id,
        :place_trajectory_deforestation
      )
      return unless place_chart

      copy_chart_attributes(place_chart, country_chart)
      # remove the "state average" line
      country_chart.chart_attributes.where(display_type: 'line').delete_all
    end

    def populate_import_trajectory(profile)
      identifier = :country_trajectory_import
      position = IMPORTERS_RUNNING_ORDER[identifier]
      title = 'Import trajectory of {{country_name}}'
      find_or_create_chart(
        profile, nil, identifier, position, title
      )
    end

    def populate_exporter_top_traders(profile)
      identifier = :country_top_consumer_actors
      position = EXPORTERS_RUNNING_ORDER[identifier]
      title = 'Top import traders of {{commodity_name}} in {{country_name}} in {{year}}'
      top_traders_chart = find_or_create_chart(
        profile, nil, identifier, position, title
      )
      find_or_create_chart_node_type(
        top_traders_chart, exporter_node_type, 'trader'
      )
    end

    def populate_exporter_top_countries(profile)
      identifier = :country_top_consumer_countries
      position = EXPORTERS_RUNNING_ORDER[identifier]
      title = 'Top import countries of {{commodity_name}} from {{country_name}} in {{year}}'
      top_countries_chart = find_or_create_chart(
        profile, nil, identifier, position, title
      )
      find_or_create_chart_node_type(
        top_countries_chart, country_of_import_node_type, 'destination'
      )
    end

    def populate_importer_top_traders(profile)
      identifier = :country_top_consumer_actors
      position = IMPORTERS_RUNNING_ORDER[identifier]
      title = 'Top export traders of {{commodity_name}} in {{country_name}} in {{year}}'
      top_traders_chart = find_or_create_chart(
        profile, nil, identifier, position, title
      )
      find_or_create_chart_node_type(
        top_traders_chart, exporter_node_type, 'trader'
      )
    end

    def populate_importer_top_countries(profile)
      identifier = :country_top_consumer_countries
      position = IMPORTERS_RUNNING_ORDER[identifier]
      title = 'Top export countries of {{commodity_name}} to {{country_name}} in {{year}}'
      top_countries_chart = find_or_create_chart(
        profile, nil, identifier, position, title
      )
      find_or_create_chart_node_type(
        top_countries_chart, country_of_export_node_type, 'destination'
      )
    end

    def populate_sustainability_indicators(profile)
      identifier = :country_indicators
      position = EXPORTERS_RUNNING_ORDER[identifier]
      title = 'Sustainability indicators in {{year}}'
      parent_country_chart = find_or_create_chart(
        profile, nil, identifier, position, title
      )

      parent_place_chart = place_chart(
        profile.context_node_type.context.country_id,
        :place_indicators
      )
      return unless parent_place_chart

      # copy over from place profile configuration
      parent_place_chart.children.each do |place_chart|
        country_chart = find_or_create_chart(
          profile,
          parent_country_chart.id,
          place_chart.identifier,
          place_chart.position,
          place_chart.title
        )
        copy_chart_attributes(place_chart, country_chart)
      end
    end

    def copy_chart_attributes(source_chart, target_chart)
      source_chart.chart_attributes.each do |source_chart_attribute|
        target_chart_attribute = target_chart.chart_attributes.find_by(
          identifier: source_chart_attribute.identifier,
          position: source_chart_attribute.position
        )

        target_chart_attribute ||= Api::V3::ChartAttribute.create(
          source_chart_attribute.
            attributes.
            except('id', 'created_at', 'updated_at').
            merge(chart_id: target_chart.id)
        )

        source_assoc_attr = source_chart_attribute.original_chart_attribute
        name = source_assoc_attr.class.name.split('::').last.underscore
        target_assoc_attr = target_chart_attribute.send(name)
        next if target_assoc_attr.present?

        source_assoc_attr.class.create(
          source_assoc_attr.
            attributes.
            except('id', 'created_at', 'updated_at').
            merge(chart_attribute_id: target_chart_attribute.id)
        )
      end
    end

    def find_or_create_profile(profile_type, context_node_type)
      profile = Api::V3::Profile.find_by(
        context_node_type_id: context_node_type.id
      )
      return profile if profile

      Api::V3::Profile.create(
        name: profile_type,
        context_node_type_id: context_node_type.id
      )
    end

    def find_or_create_chart(profile, parent_id, identifier, position, title)
      find_by_attributes = {
        profile_id: profile.id, parent_id: parent_id, identifier: identifier
      }
      chart = profile.charts.find_by(find_by_attributes)
      return chart if chart

      Api::V3::Chart.create(
        find_by_attributes.merge(position: position, title: title)
      )
    end

    def find_or_create_chart_node_type(chart, node_type, identifier)
      chart_node_type = chart.chart_node_types.find_by(identifier: identifier)
      return chart_node_type if chart_node_type

      Api::V3::ChartNodeType.create(
        chart: chart, node_type: node_type, identifier: identifier
      )
    end

    def place_chart(country_id, identifier)
      place_profile = Api::V3::Profile.
        joins(context_node_type: :context).
        find_by(
          name: Api::V3::Profile::PLACE,
          'contexts.country_id' => country_id
        )
      return nil unless place_profile

      place_profile.charts.find_by(identifier: identifier)
    end

    def country_of_export_node_type
      if defined? @country_of_export_node_type
        return @country_of_export_node_type
      end

      @country_of_export_node_type = Api::V3::NodeType.find_by_name(
        NodeTypeName::COUNTRY_OF_PRODUCTION
      )
    end

    def country_of_import_node_type
      if defined? @country_of_import_node_type
        return @country_of_import_node_type
      end

      @country_of_import_node_type = Api::V3::NodeType.find_by_name(
        NodeTypeName::COUNTRY
      )
    end

    def exporter_node_type
      return @exporter_node_type if defined? @exporter_node_type

      @exporter_node_type = Api::V3::NodeType.find_by_name(
        NodeTypeName::EXPORTER
      )
    end

    def without_callbacks
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
  end
end
