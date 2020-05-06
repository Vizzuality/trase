# == Schema Information
#
# Table name: context_node_type_properties
#
#  id                                                                                                                                           :integer          not null, primary key
#  context_node_type_id                                                                                                                         :integer          not null
#  column_group(Zero-based number of sankey column in which to display nodes of this type)                                                      :integer          not null
#  is_default(When set, show this node type as default (only use for one))                                                                      :boolean          default(FALSE), not null
#  is_geo_column(When set, show nodes on map)                                                                                                   :boolean          default(FALSE), not null
#  is_choropleth_disabled(When set, do not display the map choropleth)                                                                          :boolean          default(FALSE), not null
#  role(A grouping which defines in which filtering panel to display nodes)                                                                     :string           not null
#  prefix(Used to construct the summary sentence of selection criteria)                                                                         :text             not null
#  geometry_context_node_type_id(Use for geo columns, when geometry is to be taken from another node type (e.g. logistics hub -> municipality)) :integer
#  is_visible                                                                                                                                   :boolean          default(TRUE), not null
#
# Indexes
#
#  context_node_type_properties_context_node_type_id_idx  (context_node_type_id)
#  context_node_type_properties_context_node_type_id_key  (context_node_type_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (context_node_type_id => context_node_types.id) ON DELETE => cascade
#  fk_rails_...  (geometry_context_node_type_id => context_node_types.id)
#

module Api
  module V3
    class ContextNodeTypeProperty < YellowTable
      COLUMN_GROUP = [
        0, 1, 2, 3
      ].freeze

      SOURCE_ROLE = 'source'.freeze
      EXPORTER_ROLE = 'exporter'.freeze
      IMPORTER_ROLE = 'importer'.freeze
      DESTINATION_ROLE = 'destination'.freeze

      ROLES = [
        SOURCE_ROLE, EXPORTER_ROLE, IMPORTER_ROLE, DESTINATION_ROLE
      ].freeze

      # TODO: there should be only one default per group

      belongs_to :context_node_type
      belongs_to :geometry_context_node_type, {
        class_name: 'ContextNodeType',
        foreign_key: :geometry_context_node_type_id,
        optional: true
      }
      has_many :sankey_card_link_node_types

      validates :context_node_type, presence: true, uniqueness: true
      validates :column_group, presence: true, inclusion: COLUMN_GROUP
      validates :is_default, inclusion: {in: [true, false]}
      validates :is_geo_column, inclusion: {in: [true, false]}
      validates :is_choropleth_disabled, inclusion: {in: [true, false]}
      validates :role, inclusion: ROLES, presence: true
      validates :prefix, presence: true
      validate :geometry_context_node_type_from_same_context
      validate :geometry_context_node_type_is_geo_column

      after_commit :refresh_dependents

      def self.blue_foreign_keys
        [
          {name: :context_node_type_id, table_class: Api::V3::ContextNodeType}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::Context.refresh
        if previous_changes.key?('is_geo_column')
          Api::V3::Readonly::NodeWithFlowsOrGeo.refresh_later
        end
        return unless previous_changes.key?('role')

        refresh_role_dependents(previous_changes['role'])
      end

      def refresh_role_dependents(roles = [])
        return unless roles.any?

        Api::V3::Readonly::NodeWithFlows.refresh_later

        if roles.include?(SOURCE_ROLE)
          Api::V3::Readonly::Dashboards::Source.refresh_later
        end
        # TODO: remove once dashboards_companies_mv retired
        if (roles & [EXPORTER_ROLE, IMPORTER_ROLE]).any?
          Api::V3::Readonly::Dashboards::Company.refresh_later
        end
        # END TODO
        if roles.include?(EXPORTER_ROLE)
          Api::V3::Readonly::Dashboards::Exporter.refresh_later
        end
        if roles.include?(IMPORTER_ROLE)
          Api::V3::Readonly::Dashboards::Importer.refresh_later
        end
        if roles.include?(DESTINATION_ROLE)
          Api::V3::Readonly::Dashboards::Destination.refresh_later
        end
      end

      def self.roles
        ROLES
      end

      # by column group
      DEFAULT_ROLES = {
        0 => SOURCE_ROLE,
        1 => EXPORTER_ROLE,
        2 => IMPORTER_ROLE,
        3 => DESTINATION_ROLE
      }.freeze

      # by column group
      DEFAULT_PREFIXES = {
        0 => 'sourced from',
        1 => 'exported by',
        2 => 'imported by',
        3 => 'going into'
      }.freeze

      private

      def geometry_context_node_type_from_same_context
        return true unless geometry_context_node_type && context_node_type

        if geometry_context_node_type.context_id == context_node_type.context_id
          return true
        end

        errors.add(
          :geometry_context_node_type_id,
          "must be in same context"
        )
      end

      def geometry_context_node_type_is_geo_column
        return true unless geometry_context_node_type

        if geometry_context_node_type.context_node_type_property&.is_geo_column
          return true
        end

        errors.add(
          :geometry_context_node_type_id,
          "must be a geo column"
        )
      end
    end
  end
end
