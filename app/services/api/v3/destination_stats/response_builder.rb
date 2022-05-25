# This is used on the explore page, so that we can show flows into different destinations
# without requiring front end to pass the node type id
# We can currently have several destination node types, depending on context,
# and parametrisation by FE would be cumbersome.
module Api
  module V3
    module DestinationStats
      class ResponseBuilder
        attr_reader :nodes_stats_by_context_id

        def initialize(commodity_id, contexts_ids, params)
          @commodity_id = commodity_id
          @contexts_ids =
            if @commodity_id
              Api::V3::Context.
                joins(:context_property).
                where(commodity_id: @commodity_id, 'context_properties.is_disabled' => false).
                pluck(:context_id)
            else
              contexts_ids
            end

          initialize_contexts_by_destination_node_type
          initialize_params(params)
          initialize_errors
        end

        def call
          @nodes_stats_by_context_id = {}
          options = {
            year_start: @year_start,
            year_end: @year_end
          }
          @contexts_ids.map do |context_id|
            node_type_id = @context_destination_node_types[context_id]
            nodes_stats_list =
              Api::V3::Profiles::NodesStatsForContextsList.new(
                context_id, options.merge(node_type_id: node_type_id)
              )
            @nodes_stats_by_context_id[context_id] = nodes_stats_list.sorted_list(@attribute.original_id, limit: @limit)
          end

          @nodes_stats_by_context_id.map do |context_id, node_stats_list|
            {
              context_id: context_id,
              top_nodes: node_stats_list.map do |node_stats|
                nodes_stats_information(node_stats)
              end
            }
          end
        end

        private

        def initialize_contexts_by_destination_node_type
          destination_context_node_types = Api::V3::ContextNodeType.
            joins(:node_type).
            where(
              'node_types.name' => NodeTypeName.destination_country_names
            ).
            pluck(:context_id, :node_type_id)
          @context_destination_node_types = Hash[destination_context_node_types]
        end

        def initialize_params(params)
          @year_start = params[:year_start]&.to_i
          @year_end = params[:year_end]&.to_i
          @limit = params[:limit]&.to_i || 10
          @attribute_id = params[:attribute_id]
        end

        def initialize_errors
          if @year_start && @year_end && @year_start > @year_end
            raise 'Year start can not be higher than year end'
          end

          if @commodity_id && (@contexts_ids || []).any?
            raise 'Either commodity or contexts but not both'
          end

          @attribute = initialize_attribute
        end

        def initialize_attribute
          if @attribute_id
            attribute = Api::V3::Readonly::Attribute.find_by(
              id: @attribute_id, original_type: 'Quant'
            )
            raise "Attribute #{@attribute_id} not found" unless attribute
          else
            volume_quant = Dictionary::Quant.instance.get('Volume')
            attribute = Api::V3::Readonly::Attribute.find_by(
              original_id: volume_quant.id, original_type: 'Quant'
            )
            raise 'Quant Volume not found' unless attribute
          end
          attribute
        end

        def nodes_stats_information(nodes_stats)
          {
            id: nodes_stats.node_id,
            name: nodes_stats.name,
            geo_id: nodes_stats.geo_id,
            attribute: attribute_information(nodes_stats)
          }
        end

        def attribute_information(nodes_stats)
          {
            id: @attribute.id,
            indicator: @attribute.display_name,
            unit: @attribute.unit,
            value: nodes_stats.value,
            height: nodes_stats.height
          }
        end
      end
    end
  end
end
