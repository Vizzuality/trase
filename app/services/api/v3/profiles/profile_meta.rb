module Api
  module V3
    module Profiles
      class ProfileMeta
        include ActiveModel::Serialization

        delegate :id, :context_id, :years, to: :@node_with_flows
        delegate :commodity_id, :country_id, to: :@context
        delegate :name,
                 :main_topojson_path,
                 :main_topojson_root,
                 :adm_1_name,
                 :adm_1_topojson_path,
                 :adm_1_topojson_root,
                 :adm_2_name,
                 :adm_2_topojson_path,
                 :adm_2_topojson_root,
                 to: :@profile

        attr_reader :activity,
                    :commodities,
                    :activities,
                    :profile,
                    :charts

        ACTIVITIES = {
          Api::V3::ContextNodeTypeProperty::SOURCE_ROLE => :exporter,
          Api::V3::ContextNodeTypeProperty::EXPORTER_ROLE => :exporter,
          Api::V3::ContextNodeTypeProperty::IMPORTER_ROLE => :importer,
          Api::V3::ContextNodeTypeProperty::DESTINATION_ROLE => :importer
        }.freeze

        # @param node [Api::V3::NodeWithFlows]
        # @param context [Api::V3::Context]
        def initialize(node_with_flows, context)
          @node_with_flows = node_with_flows
          @context = context

          @activity = ACTIVITIES[node_with_flows.role]

          initialize_profile
          initialize_commodities
          initialize_activities
        end

        private

        def initialize_profile
          @profile = Api::V3::Profile.
            joins(:context_node_type).
            where(
              'context_node_types.context_id' => @node_with_flows.context_id,
              'context_node_types.column_position' =>
                @node_with_flows.column_position
            ).
            includes(charts: :children).
            references(:charts).
            where('charts.parent_id IS NULL').
            first
          @charts = @profile.charts
        end

        def initialize_commodities
          @commodities = exactly_same_node_all_commodities.map do |node|
            {
              id: node['commodity_id'],
              name: node['commodity']
            }
          end.uniq
        end

        # Identifies all "activities" for the "same node", for example:
        #   - same country as exporter and importer
        #   - same company as exporter and importer
        # the trick is, these are actually different nodes
        # and might be in different contexts
        def initialize_activities
          @activities = almost_same_node_same_commodity.map do |node|
            {
              id: node.id,
              name: ACTIVITIES[node.role]
            }
          end.uniq
        end

        def almost_same_node_same_commodity
          nodes = Api::V3::Readonly::NodeWithFlows.
            without_unknowns.
            without_domestic.
            select(:id, :role).
            joins(:context).
            where(
              'contexts.commodity_id' => @context.commodity_id,
              profile: @node_with_flows.profile
            )

          if @node_with_flows.geo_id.present?
            nodes.where(geo_id: @node_with_flows.geo_id)
          elsif @node_with_flows.main_id.present?
            nodes.where(main_id: @node_with_flows.main_id)
          else
            # if neither is present, just retrieve by id
            nodes.where(id: @node_with_flows.id)
          end
        end

        def exactly_same_node_all_commodities
          Api::V3::Readonly::NodeWithFlows.
            without_unknowns.
            without_domestic.
            select(
              'contexts.commodity_id',
              'commodities.name AS commodity'
            ).
            joins(context: :commodity).
            where(
              id: @node_with_flows.id,
              profile: @node_with_flows.profile
            )
        end
      end
    end
  end
end
