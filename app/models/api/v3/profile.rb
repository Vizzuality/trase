# == Schema Information
#
# Table name: profiles
#
#  id                                                                                                                                            :integer          not null, primary key
#  context_node_type_id                                                                                                                          :integer          not null
#  name(Profile name, either actor or place. One of restricted set of values.)                                                                   :text
#  main_topojson_path(Path must be relative to https://github.com/Vizzuality/trase/tree/develop/frontend/public/vector_layers and start with /)  :string
#  main_topojson_root(Path within the TopoJSON file where geometries are contained)                                                              :string
#  adm_1_name                                                                                                                                    :string
#  adm_1_topojson_path(Path must be relative to https://github.com/Vizzuality/trase/tree/develop/frontend/public/vector_layers and start with /) :string
#  adm_1_topojson_root(Path within the TopoJSON file where geometries are contained)                                                             :string
#  adm_2_name                                                                                                                                    :string
#  adm_2_topojson_path(Path must be relative to https://github.com/Vizzuality/trase/tree/develop/frontend/public/vector_layers and start with /) :string
#  adm_2_topojson_root(Path within the TopoJSON file where geometries are contained)                                                             :string
#
# Indexes
#
#  profiles_context_node_type_id_name_key  (context_node_type_id,name) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (context_node_type_id => context_node_types.id) ON DELETE => cascade
#

module Api
  module V3
    class Profile < YellowTable
      ACTOR = 'actor'.freeze
      PLACE = 'place'.freeze
      COUNTRY = 'country'.freeze

      NAMES = [ACTOR, PLACE, COUNTRY].freeze

      belongs_to :context_node_type
      has_many :charts, -> { order(:position) }

      delegate :context, to: :context_node_type, allow_nil: false
      delegate :node_type, to: :context_node_type, allow_nil: false

      validates :context_node_type, presence: true
      validates :name,
                uniqueness: {scope: :context_node_type},
                inclusion: NAMES

      after_commit :refresh_dependents

      def self.select_options
        Api::V3::Profile.includes(
          context_node_type: [{context: [:country, :commodity]}, :node_type]
        ).order(
          'countries.name, commodities.name, node_types.name'
        ).all.map do |profile|
          context_node_type = profile&.context_node_type
          [
            [
              context_node_type&.context&.country&.name,
              context_node_type&.context&.commodity&.name,
              context_node_type&.node_type&.name,
              profile.name
            ].join(' / '),
            profile.id
          ]
        end
      end

      def self.blue_foreign_keys
        [
          {name: :context_node_type_id, table_class: Api::V3::ContextNodeType}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::NodeWithFlows.refresh
        Api::V3::Readonly::NodeWithFlowsOrGeo.refresh
        Api::V3::Readonly::Dashboards::Source.refresh(skip_dependencies: true)
        Api::V3::Readonly::Dashboards::Company.refresh(skip_dependencies: true)
        Api::V3::Readonly::Dashboards::Exporter.refresh(skip_dependencies: true)
        Api::V3::Readonly::Dashboards::Importer.refresh(skip_dependencies: true)
        Api::V3::Readonly::Dashboards::Destination.refresh(skip_dependencies: true)
        Api::V3::Readonly::Dashboards::Country.refresh(skip_dependencies: true)
        Api::V3::Readonly::Dashboards::Commodity.refresh(skip_dependencies: true)
        Api::V3::Readonly::Context.refresh
        refresh_actor_basic_attributes
      end

      def refresh_actor_basic_attributes
        return unless saved_change_to_name? ||
          saved_change_to_context_node_type_id?

        # Update previous NodeWithFlows
        # The behaviour is the same if the name or the context_node_type changes
        if context_node_type_id_before_last_save
          update_node_with_flows_actor_basic_attributes(
            context_node_type_id_before_last_save
          )
        end

        # If we have just updated the name, it has already been updated
        return unless saved_change_to_context_node_type_id?

        # Update new NodeWithFlows
        update_node_with_flows_actor_basic_attributes(context_node_type_id)
      end

      def update_node_with_flows_actor_basic_attributes(context_node_type_id)
        context_node_type = Api::V3::ContextNodeType.find(context_node_type_id)
        context = context_node_type.context
        nodes = context_node_type.node_type.nodes
        node_with_flows = Api::V3::Readonly::NodeWithFlows.
          without_unknowns.
          without_domestic.
          where(context_id: context.id, id: nodes.map(&:id))
        NodeWithFlowsRefreshActorBasicAttributesWorker.new.perform(
          node_with_flows.map(&:id)
        )
      end
    end
  end
end
