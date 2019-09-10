module Api
  module V3
    module NodesStats
      class ResponseBuilder
        attr_reader :nodes_stats

        def initialize(commodity_id, contexts_ids, params)
          @commodity_id = commodity_id
          @contexts_ids = contexts_ids

          initialize_params(params)

          initialize_errors
        end

        def call
          @nodes_stats = find_nodes_stats

          formatted_nodes_stats
        end

        private

        def initialize_params(params)
          @year_start = params[:year_start]&.to_i
          @year_end = params[:year_end]&.to_i
          @limit = params[:limit]&.to_i || 10
          @node_type_id = params[:node_type_id]
          @attribute_id = params[:attribute_id]
          @other_attributes_ids = params[:other_attributes_ids] || []
        end

        def initialize_errors
          if @year_start && @year_end && @year_start > @year_end
            raise 'Year start can not be higher than year end'
          end

          if @commodity_id && (@contexts_ids || []).any?
            raise 'Either commodity or contexts but not both'
          end

          @attribute = Api::V3::Readonly::Attribute.find_by(
            id: @attribute_id, original_type: 'Quant'
          )
          raise "Attribute #{@attribute_id} not found" unless @attribute

          @other_attributes = @other_attributes_ids.map do |attribute_id|
            attribute = Api::V3::Readonly::Attribute.find_by(
              id: attribute_id, original_type: 'Quant'
            )

            raise "Attribute #{attribute_id} not found" unless attribute

            attribute
          end
        end

        def formatted_nodes_stats
          filter_name = @commodity_id ? 'commodity_id' : 'context_id'
          filter_values =
            @commodity_id.present? ? [@commodity_id] : @contexts_ids
          filter_values.map do |filter|
            {
              filter_name => filter,
              top_nodes: @nodes_stats.map do |node_stats|
                nodes_stats_information(node_stats)
              end
            }
          end
        end

        def nodes_stats_information(nodes_stats)
          {
            id: nodes_stats.node_id,
            name: nodes_stats.name,
            geo_id: nodes_stats.geo_id,
            attribute: attribute_information(nodes_stats),
            other_attributes: other_attributes_information
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

        def other_attributes_information
          @other_attributes.map do |attribute|
            nodes_stats = find_nodes_stats(attribute).first
            {
              id: attribute.id,
              name: attribute.display_name,
              unit: attribute.unit,
              value: nodes_stats.value,
              height: nodes_stats.height
            }
          end
        end

        def find_nodes_stats(attribute=nil)
          options = {
            node_type_id: @node_type_id,
            year_start: @year_start,
            year_end: @year_end,
          }

          if @commodity_id
            nodes_stats_list =
              Api::V3::Profiles::NodesStatsForCommodityList.new(
                @commodity_id, options
              )
          else
            nodes_stats_list =
              Api::V3::Profiles::NodesStatsForContextsList.new(
                @contexts_ids, options
              )
          end

          nodes_stats_attribute = attribute || @attribute
          nodes_stats_limit = attribute ? 1 : @limit
          nodes_stats_list.sorted_list(
            nodes_stats_attribute.original_id, limit: nodes_stats_limit
          )
        end
      end
    end
  end
end
