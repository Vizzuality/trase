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
          filter_name = @commodity_id ? 'commodity_id' : 'context_id'
          filter_values =
            @commodity_id.present? ? [@commodity_id] : @contexts_ids
          filter_values.map do |filter|
            {
              filter_name => filter,
              attributes: @quants_ids.map do |quant_id|
                quant = Api::V3::Quant.find(quant_id)
                targets = @nodes_stats.where(quant_id: quant_id)
                {
                  id: quant_id,
                  indicator: quant.display_name,
                  unit: quant.unit,
                  targets: nodes_stats_attributes(targets)
                }
              end
            }
          end
        end

        private

        def initialize_params(params)
          @year_start = params[:year_start]&.to_i
          @year_end = params[:year_end]&.to_i
          @limit = params[:limit]&.to_i || 10
          @node_type_id = params[:node_type_id]
          @quants_ids = params[:attribute_ids]
        end

        def initialize_nodes_stats
          if @commodity_id
            nodes_stats_list =
              Api::V3::Profiles::NodesStatsForCommodityList.new(
                @commodity_id,
                quants_ids: @quants_ids,
                node_type_id: @node_type_id,
                year_start: @year_start,
                year_end: @year_end
              )
          else
            nodes_stats_list =
              Api::V3::Profiles::NodesStatsForContextsList.new(
                @contexts_ids,
                quants_ids: @quants_ids,
                node_type_id: @node_type_id,
                year_start: @year_start,
                year_end: @year_end
              )
          end

          @nodes_stats = nodes_stats_list.
            sorted_list(@quants_ids, limit: @limit)
        end

        def initialize_errors
          @errors = []
          if @year_start && @year_end && @year_start > @year_end
            @errors << 'Year start can not be higher than year end'
          end
          if @commodity_id && (@contexts_ids || []).any?
            @errors << 'Either commodity or contexts but not both'
          end
        end

        def nodes_stats_attributes(nodes_stats)
          nodes_stats.map do |node_stats|
            {
              id: node_stats['node_id'],
              name: node_stats['name'],
              value: node_stats['value'],
              height: node_stats['height'],
            }
          end
        end
      end
    end
  end
end
