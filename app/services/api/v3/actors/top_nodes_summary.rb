module Api
  module V3
    module Actors
      class TopNodesSummary
        # @param context [Api::V3::Context]
        # @param node [Api::V3::Node]
        # @year [Integer]
        def initialize(context, node, year)
          @context = context
          @node = node
          @year = year
          quant_dictionary = Dictionary::Quant.instance
          @volume_attribute = quant_dictionary.get('Volume')
          raise 'Quant Volume not found' unless @volume_attribute.present?
          @soy_production_attribute = quant_dictionary.get('SOY_TN')
          unless @soy_production_attribute.present?
            raise 'Quant SOY_TN not found'
          end
          initialize_flow_stats_for_node
        end

        # Top nodes (destinations and sources) linked to this actor node
        # across years
        # @param node_type [String or Array<String>]
        def call(node_type)
          years = @flow_stats.available_years_for_attribute(@volume_attribute)
          map_attribute = Api::V3::Readonly::MapAttribute.where(
            context_id: @context.id,
            attribute_type: 'quant',
            original_attribute_id: @soy_production_attribute.id
          )

          buckets = map_attribute.try(:single_layer_buckets) ||
            [5000, 100_000, 300_000, 1_000_000]

          result = {
            included_years: years, buckets: buckets
          }
          if node_type.is_a?(Array)
            node_type.each do |nt|
              result[nt.downcase] = nodes_by_year_summary_for_indicator(
                nt, years, buckets, @volume_attribute
              )
            end
          else
            result = result.merge(
              nodes_by_year_summary_for_indicator(
                node_type, years, buckets, @volume_attribute
              )
            )
          end
          result
        end

        private

        def initialize_flow_stats_for_node
          @flow_stats = Api::V3::Profiles::FlowStatsForNode.new(
            @context, @year, @node
          )
        end

        def initialize_top_nodes(node_type, attribute)
          top_nodes_list = Api::V3::Profiles::TopNodesList.new(
            @context,
            @node,
            year_start: @year,
            year_end: @year,
            other_node_type_name: node_type
          )
          @top_nodes = top_nodes_list.sorted_list(
            attribute,
            include_domestic_consumption: false,
            limit: nil
          )
          @top_node_values_by_year = top_nodes_list.
            unsorted_list_grouped_by_year(
              attribute,
              include_domestic_consumption: false,
              limit: nil
            ).all
        end

        def nodes_by_year_summary_for_indicator(
          node_type, years, buckets, attribute
        )
          initialize_top_nodes(node_type, attribute)

          lines = @top_nodes.map do |node|
            {
              name: node['name'],
              geo_id: node['geo_id'],
              values: years.map do |year|
                year_node = @top_node_values_by_year.find do |value|
                  value['node_id'] == node['node_id'] && value['year'] == year
                end
                year_node && year_node['value']
              end
            }
          end
          year_idx = years.index(@year)

          lines.each do |line|
            value = line[:values][year_idx]
            line[:value9] = value && bucket_index_for_value(buckets, value)
          end

          {
            lines: lines,
            unit: 't',
            style: {
              type: 'line-points',
              style: 'line-pink-with-points'
            }
          }
        end

        def bucket_index_for_value(buckets, value)
          prev_bucket = 0
          bucket = buckets.each_with_index do |bucket_value, index|
            break index if value >= prev_bucket && value < bucket_value
          end
          if bucket.is_a? Integer
            bucket
          else
            buckets.size # last bucket
          end
        end
      end
    end
  end
end
