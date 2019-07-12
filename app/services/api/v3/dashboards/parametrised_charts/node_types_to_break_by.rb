# Returns node types by which to break down for non-overview charts,
# taking into account user selection and availability of node types
# in the given context.
module Api
  module V3
    module Dashboards
      module ParametrisedCharts
        class NodeTypesToBreakBy
          # @param context [Api::V3::Context]
          # @param [Array<Integer>] source_node_types_ids
          # @param [Array<Integer>] company_node_types_ids
          # @param [Array<Integer>] destination_node_types_ids
          def initialize(
            context,
            source_node_types_ids = [],
            company_node_types_ids = [],
            destination_node_types_ids = []
          )
            @context = context
            @source_node_types_ids = source_node_types_ids || []
            @company_node_types_ids = company_node_types_ids || []
            @destination_node_types_ids = destination_node_types_ids || []

            context_node_types = @context.context_node_types.
              includes(:context_node_type_property, :node_type)
            @context_node_types_by_role = context_node_types.group_by do |cnt|
              cnt.context_node_type_property.role
            end
          end

          def selected_node_types
            selected_source_node_types +
              selected_exporter_node_types +
              selected_importer_node_types +
              selected_destination_node_types
          end

          def unselected_node_types
            (source_node_types - selected_source_node_types) +
              (exporter_node_types - selected_exporter_node_types) +
              (importer_node_types - selected_importer_node_types) +
              (destination_node_types - selected_destination_node_types)
          end

          private

          def source_node_types
            @context_node_types_by_role[
              Api::V3::ContextNodeTypeProperty::SOURCE_ROLE
            ]&.map(&:node_type) || []
          end

          def selected_source_node_types
            source_node_types.select do |nt|
              @source_node_types_ids.include?(nt.id)
            end
          end

          def exporter_node_types
            @context_node_types_by_role[
              Api::V3::ContextNodeTypeProperty::EXPORTER_ROLE
            ]&.map(&:node_type) || []
          end

          def selected_exporter_node_types
            exporter_node_types.select do |nt|
              @company_node_types_ids.include?(nt.id)
            end
          end

          def importer_node_types
            @context_node_types_by_role[
              Api::V3::ContextNodeTypeProperty::IMPORTER_ROLE
            ]&.map(&:node_type) || []
          end

          def selected_importer_node_types
            importer_node_types.select do |nt|
              @company_node_types_ids.include?(nt.id)
            end
          end

          def destination_node_types
            @context_node_types_by_role[
              Api::V3::ContextNodeTypeProperty::DESTINATION_ROLE
            ]&.map(&:node_type) || []
          end

          def selected_destination_node_types
            destination_node_types.select do |nt|
              @destination_node_types_ids.include?(nt.id)
            end
          end
        end
      end
    end
  end
end
