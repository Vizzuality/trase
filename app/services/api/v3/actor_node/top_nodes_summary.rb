module Api
  module V3
    module ActorNode
      class TopNodesSummary
        def initialize(context, year, node)
          @context = context
          @year = year
          @node = node
          @volume_attribute = Dictionary::Quant.instance.get('Volume')
          raise 'Quant Volume not found' unless @volume_attribute.present?
          @soy_production_attribute = Dictionary::Quant.instance.get('SOY_TN')
          raise 'Quant SOY_TN not found' unless @soy_production_attribute.present?
        end

        # looking for top nodes (destinations and sources) linked to this actor node
        # across years
        def call(node_list_label, node_type)
          flows_for_node = Api::V3::ActorNode::FlowsForNode.new(@context, @year, @node)
          years = flows_for_node.available_years_for_attribute(@volume_attribute)
          map_attribute = Api::V3::Readonly::MapAttribute.where(
            context_id: @context.id,
            attribute_type: 'quant',
            original_attribute_id: @soy_production_attribute.id
          )
          buckets = map_attribute.try(:bucket_5) || [5000, 100_000, 300_000, 1_000_000] # TODO: bucket_9
          result = {
            node_list_label => {
              included_years: years, buckets: buckets
            }
          }
          if node_type.is_a?(Array)
            node_type.each do |nt|
              result[node_list_label][nt.downcase] = nodes_by_year_summary_for_indicator(
                nt, years, buckets, @volume_attribute
              )
            end
          else
            result[node_list_label] = result[node_list_label].merge(
              nodes_by_year_summary_for_indicator(node_type, years, buckets, @volume_attribute)
            )
          end
          result
        end

        private

        def initialize_top_nodes(node_type, attribute)
          top_nodes_list = Api::V3::PlaceNode::TopNodesList.
            new(@context, @year, @node, other_node_type_name: node_type)
          @top_nodes = top_nodes_list.sorted_list(attribute, false, nil)
          @top_node_values_by_year = top_nodes_list.
            unsorted_list_grouped_by_year(attribute, false, nil).all
        end

        def nodes_by_year_summary_for_indicator(node_type, years, buckets, attribute)
          initialize_top_nodes(node_type, attribute)

          lines = @top_nodes.map do |node|
            {
              name: node['name'],
              geo_id: node['geo_id'],
              values: years.map do |year|
                year_node = @top_node_values_by_year.select do |v|
                  v['node_id'] == node['node_id'] && v['year'] == year
                end.first
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
