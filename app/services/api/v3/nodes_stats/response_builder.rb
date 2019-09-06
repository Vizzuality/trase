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
          initialize_nodes_stats

          formatted_nodes_stats
        end

        private

        def initialize_params(params)
          @year_start = params[:year_start]&.to_i
          @year_end = params[:year_end]&.to_i
          @limit = params[:limit]&.to_i || 10
          @node_type_id = params[:node_type_id]
          @attributes_ids = params[:attributes_ids]
        end

        def initialize_nodes_stats
          options = {
            node_type_id: @node_type_id,
            year_start: @year_start,
            year_end: @year_end
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

          @nodes_stats = nodes_stats_list.
            sorted_list(@attributes.map(&:original_id), limit: @limit)
        end

        def initialize_errors
          if @year_start && @year_end && @year_start > @year_end
            raise 'Year start can not be higher than year end'
          end

          if @commodity_id && (@contexts_ids || []).any?
            raise 'Either commodity or contexts but not both'
          end

          @attributes = @attributes_ids.map do |attribute_id|
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
              attributes: @attributes.map do |attribute|
                attribute_information(attribute)
              end
            }
          end
        end

        def attribute_information(attribute)
          targets = @nodes_stats.where(quant_id: attribute.original_id)
          {
            id: attribute.id,
            indicator: attribute.display_name,
            unit: attribute.unit,
            targets: nodes_stats_information(targets)
          }
        end

        def nodes_stats_information(nodes_stats)
          nodes_stats.map do |node_stats|
            {
              id: node_stats['node_id'],
              name: node_stats['name'],
              value: node_stats['value'],
              height: node_stats['height']
            }
          end
        end
      end
    end
  end
end
