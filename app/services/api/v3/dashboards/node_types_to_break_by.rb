# Returns node types by which to break down for non-global charts,
# taking into account user selection and availability of node types
# in the given context.
module Api
  module V3
    module Dashboards
      class NodeTypesToBreakBy
        # TODO: incorporate the new "role" attribute here
        SOURCE_COLUMN_GROUP = 0
        EXPORTER_COLUMN_GROUP = 1
        IMPORTER_COLUMN_GROUP = 2
        DESTINATION_COLUMN_GROUP = 3

        # @param context [Api::V3::Context]
        # @param [Array<Integer>] source_node_types_ids
        # @param [Array<Integer>] company_node_types_ids
        # @param [Array<Integer>] destination_node_types_ids
        def initialize(context, source_node_types_ids, company_node_types_ids, destination_node_types_ids)
          @context = context
          @source_node_types_ids = source_node_types_ids || []
          @company_node_types_ids = company_node_types_ids || []
          @destination_node_types_ids = destination_node_types_ids || []
        end

        def call
          context_node_types = @context.context_node_types.
            includes(:context_node_type_property, :node_type)
          grouped_context_node_types = context_node_types.group_by do |cnt|
            cnt.context_node_type_property.column_group
          end

          result =
            enabled_source_node_types(
              grouped_context_node_types[SOURCE_COLUMN_GROUP]
            ) +
            enabled_exporter_node_types(
              grouped_context_node_types[EXPORTER_COLUMN_GROUP]
            ) +
            enabled_importer_node_types(
              grouped_context_node_types[IMPORTER_COLUMN_GROUP]
            ) +
            enabled_destination_node_types(
              grouped_context_node_types[DESTINATION_COLUMN_GROUP]
            )

          result.map(&:node_type)
        end

        private

        def enabled_source_node_types(source_node_types)
          return [] unless source_node_types

          source_node_types.select do |cnt|
            if @source_node_types_ids.any?
              @source_node_types_ids.include?(cnt.node_type_id)
            else
              true
            end
          end
        end

        def enabled_exporter_node_types(exporter_node_types)
          return [] unless exporter_node_types

          exporter_node_types.select do |cnt|
            if @company_node_types_ids.any?
              @company_node_types_ids.include?(cnt.node_type_id)
            else
              true
            end
          end
        end

        def enabled_importer_node_types(importer_node_types)
          return [] unless importer_node_types

          importer_node_types.select do |cnt|
            if @company_node_types_ids.any?
              @company_node_types_ids.include?(cnt.node_type_id)
            else
              true
            end
          end
        end

        def enabled_destination_node_types(destination_node_types)
          return [] unless destination_node_types

          destination_node_types.select do |cnt|
            if @destination_node_types_ids.any?
              @destination_node_types_ids.include?(cnt.node_type_id)
            else
              true
            end
          end
        end
      end
    end
  end
end
