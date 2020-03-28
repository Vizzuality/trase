namespace :db do
  namespace :country_profiles do
    desc 'Populated country profiles configuration'
    task populate: :environment do
      # find contexts with country of export nodes
      country_of_export_node_type = Api::V3::NodeType.find_by_name(
        NodeTypeName::COUNTRY_OF_PRODUCTION
      )
      exporter_node_type = Api::V3::NodeType.find_by_name(
        NodeTypeName::EXPORTER
      )
      country_of_import_node_type = Api::V3::NodeType.find_by_name(
        NodeTypeName::COUNTRY
      )

      without_chart_callbacks do
        exporter_context_node_types = Api::V3::ContextNodeType.where(
          node_type_id: country_of_export_node_type.id
        )

        exporter_context_node_types.each do |cnt|
          profile = find_or_create_profile(Api::V3::Profile::COUNTRY, cnt)
          title = 'Top import traders of {{commodity_name}} in {{country_name}} in {{year}}'
          top_traders_chart = find_or_create_chart(
            profile, :country_top_consumer_actors, 4, title
          )
          find_or_create_chart_node_type(
            top_traders_chart, exporter_node_type, 'trader'
          )
          title = 'Top import countries of {{commodity_name}} from {{country_name}} in {{year}}'
          top_countries_chart = find_or_create_chart(
            profile, :country_top_consumer_countries, 5, title
          )
          find_or_create_chart_node_type(
            top_countries_chart, country_of_import_node_type, 'destination'
          )
          basic_attributes_chart = find_or_create_chart(
            profile, :country_basic_attributes, 0, 'Basic attributes'
          )
        end

        importer_context_node_types = Api::V3::ContextNodeType.where(
          node_type_id: country_of_import_node_type.id
        )

        importer_context_node_types.each do |cnt|
          profile = find_or_create_profile(Api::V3::Profile::COUNTRY, cnt)
          title = 'Top export traders of {{commodity_name}} in {{country_name}} in {{year}}'
          top_traders_chart = find_or_create_chart(
            profile, :country_top_consumer_actors, 4, title
          )
          find_or_create_chart_node_type(
            top_traders_chart, exporter_node_type, 'trader'
          )
          title = 'Top export countries of {{commodity_name}} to {{country_name}} in {{year}}'
          top_countries_chart = find_or_create_chart(
            profile, :country_top_consumer_countries, 5, title
          )
          find_or_create_chart_node_type(
            top_countries_chart, country_of_export_node_type, 'destination'
          )
          basic_attributes_chart = find_or_create_chart(
            profile, :country_basic_attributes, 0, 'Basic attributes'
          )
        end
      end

      Api::V3::Readonly::FlowNode.refresh(sync: true)
      Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
      Api::V3::Readonly::NodeWithFlows.refresh(sync: true, skip_dependencies: true)
      Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
      Api::V3::Readonly::ChartAttribute.refresh(sync: true, skip_dependencies: true)
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

    def find_or_create_chart(profile, identifier, position, title)
      chart = profile.charts.find_by(identifier: identifier)
      return chart if chart

      Api::V3::Chart.create(
        profile: profile, identifier: identifier, position: position, title: title
      )
    end

    def find_or_create_chart_node_type(chart, node_type, identifier)
      chart_node_type = chart.chart_node_types.find_by(identifier: identifier)
      return chart_node_type if chart_node_type

      Api::V3::ChartNodeType.create(
        chart: chart, node_type: node_type, identifier: identifier
      )
    end

    def without_callbacks
      Api::V3::Profile.skip_callback(:commit, :after, :refresh_dependents)
      Api::V3::Chart.skip_callback(:commit, :after, :refresh_dependents)
      Api::V3::ChartAttribute.skip_callback(:commit, :after, :refresh_dependents)
      Api::V3::ChartNodeType.skip_callback(:commit, :after, :refresh_dependents)
      yield
      Api::V3::Profile.set_callback(:commit, :after, :refresh_dependents)
      Api::V3::Chart.set_callback(:commit, :after, :refresh_dependents)
      Api::V3::ChartAttribute.set_callback(:commit, :after, :refresh_dependents)
      Api::V3::ChartNodeType.set_callback(:commit, :after, :refresh_dependents)
    end
  end
end
