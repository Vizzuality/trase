module Api
  module V3
    module Dashboards
      module ChartParameters
        class FlowValues < Base
          attr_reader :cont_attribute,
                      :ncont_attribute,
                      :start_year,
                      :end_year,
                      :sources_ids,
                      :companies_ids,
                      :destinations_ids,
                      :node_type,
                      :top_n,
                      :single_filter_key

          # @param params [Hash]
          # @option params [Integer] cont_attribute_id
          # @option params [Integer] ncont_attribute_id
          # @option params [Array<Integer>] sources_ids
          # @option params [Array<Integer>] companies_ids
          # @option params [Array<Integer>] destinations_ids
          # @option params [Integer] node_type_id
          # @option params [Integer] top_n
          # @option params [String] single_filter_key
          def initialize(params)
            super

            initialize_cont_attribute params[:cont_attribute_id]
            initialize_ncont_attribute params[:ncont_attribute_id]

            @sources_ids = params[:sources_ids] || []
            @companies_ids = params[:companies_ids] || []
            @destinations_ids = params[:destinations_ids] || []
            initialize_node_type(params[:node_type_id])

            @top_n = params[:top_n]
            @single_filter_key = params[:single_filter_key]
          end

          def node_type_idx
            return unless @node_type

            Api::V3::NodeType.node_index_for_id(@context, @node_type.id)
          end

          def nodes
            return @nodes if defined? @nodes

            @nodes = Api::V3::Node.where(
              id: @sources_ids + @companies_ids + @destinations_ids
            ).includes(:node_type)
          end

          def nodes_ids_by_position
            return @nodes_ids_by_position if defined? @nodes_ids_by_position

            node_type_ids_to_positions = Hash[
              @context.context_node_types.
                select(:node_type_id, :column_position).map do |cnt|
                [cnt.node_type_id, cnt.column_position]
              end
            ]
            @nodes_ids_by_position = nodes.select(:id, :node_type_id).
              group_by do |node|
                node_type_ids_to_positions[node.node_type_id]
              end
          end

          private

          def initialize_cont_attribute(cont_attribute_id)
            return unless cont_attribute_id.present?

            resize_by_attribute = Api::V3::Readonly::ResizeByAttribute.
              select(:attribute_id).
              includes(:readonly_attribute).
              find_by_context_id_and_attribute_id!(
                @context.id, cont_attribute_id
              )
            raise ActiveRecord::RecordNotFound unless resize_by_attribute

            @cont_attribute = resize_by_attribute.readonly_attribute
          end

          def initialize_ncont_attribute(ncont_attribute_id)
            return unless ncont_attribute_id.present?

            recolor_by_attribute = Api::V3::Readonly::RecolorByAttribute.
              select(:attribute_id).
              includes(:readonly_attribute).
              find_by_context_id_and_attribute_id!(
                @context.id, ncont_attribute_id
              )
            raise ActiveRecord::RecordNotFound unless recolor_by_attribute

            @ncont_attribute = recolor_by_attribute.readonly_attribute
          end

          def initialize_node_type(node_type_id)
            return unless node_type_id.present?

            @node_type = Api::V3::NodeType.find(node_type_id)
          end
        end
      end
    end
  end
end
