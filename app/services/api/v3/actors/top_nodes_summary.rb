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
          # Assumption: Volume is a special quant which always exists
          @volume_attribute = quant_dictionary.get('Volume')
          unless @volume_attribute.present?
            raise ActiveRecord::RecordNotFound.new 'Quant Volume not found'
          end

          initialize_flow_stats_for_node
        end

        # Top nodes (destinations and sources) linked to this actor node
        # across years
        # @param node_type [String or Array<String>]
        # @param attribute [Api::V3::Ind or Api::V3::Qual or Api::V3::Quant]
        def call(node_type, commodity_production_attribute)
          years = @flow_stats.available_years_for_attribute(@volume_attribute)
          map_attribute = Api::V3::Readonly::MapAttribute.where(
            context_id: @context.id,
            attribute_type: commodity_production_attribute.simple_type,
            original_attribute_id: commodity_production_attribute.id
          )
          buckets = map_attribute.try(:single_layer_buckets) ||
            [5000, 100_000, 300_000, 1_000_000]
          node_types =
            if node_type.is_a?(Array)
              node_type
            else
              [node_type]
            end
          result = {
            included_years: years,
            buckets: buckets,
            tabs: node_types.map(&:downcase)
          }

          node_types.each do |nt|
            result[nt.downcase] = nodes_by_year_summary_for_indicator(
              nt, years, buckets, @volume_attribute
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
          top_node_values_by_year = top_nodes_list.
            unsorted_list_grouped_by_year(
              attribute,
              include_domestic_consumption: false,
              limit: nil
            ).all
          @top_node_values_by_year_hash = {}
          top_node_values_by_year.map do |top_node_value|
            year = top_node_value['year']
            @top_node_values_by_year_hash[year] ||= {}
            @top_node_values_by_year_hash[year][top_node_value['node_id']] =
              top_node_value['value']
          end
        end

        def nodes_by_year_summary_for_indicator(
          node_type, years, buckets, attribute
        )
          initialize_top_nodes(node_type, attribute)

          profile_type = Api::V3::Profile.
            joins(context_node_type: :node_type).
            where('node_types.name' => node_type).
            where('context_node_types.context' => @context).
            select('profiles.name').
            first

          profile_type_name = profile_type.name unless profile_type.nil?

          lines = @top_nodes.map do |node|
            {
              name: node['name'],
              node_id: node['node_id'],
              geo_id: node['geo_id'],
              values: years.map do |year|
                values_for_year = @top_node_values_by_year_hash[year]
                next nil unless values_for_year

                values_for_year[node['node_id']]
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
            profile_type: profile_type_name,
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
