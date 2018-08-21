module Api
  module V3
    module Actors
      class SustainabilityTable
        include Api::V3::Profiles::AttributesInitializer

        # @param context [Api::V3::Context]
        # @param node [Api::V3::Node]
        # @year [Integer]
        def initialize(context, node, year)
          @context = context
          @node = node
          @year = year
          @volume_attribute = Dictionary::Quant.instance.get('Volume')
          raise 'Quant Volume not found' unless @volume_attribute.present?
          chart = initialize_chart(:actor, nil, :sustainability)
          @chart_attributes, @attributes = initialize_attributes(chart)
          initialize_flow_stats_for_node
        end

        def call
          [
            {
              group_name: 'Municipalities',
              node_type: NodeTypeName::MUNICIPALITY
            },
            {
              group_name: 'Biomes',
              node_type: NodeTypeName::BIOME,
              is_total: true
            }
          ].map do |group|
            sustainability_for_group(
              group[:group_name], group[:node_type], group[:is_total]
            )
          end
        end

        private

        def initialize_flow_stats_for_node
          @flow_stats = Api::V3::Profiles::FlowStatsForNode.new(
            @context, @year, @node
          )
        end

        def sustainability_for_group(name, node_type, include_totals)
          top_nodes_list = Api::V3::Profiles::TopNodesList.new(
            @context,
            @node,
            year_start: @year,
            year_end: @year,
            other_node_type_name: node_type
          )
          top_nodes = top_nodes_list.sorted_list(
            @volume_attribute,
            include_domestic_consumption: false,
            limit: 10
          )
          group_totals_hash = {}
          rows = top_nodes.map do |node|
            data_row(group_totals_hash, node_type, node)
          end
          if include_totals && !rows.empty?
            rows << totals_row(group_totals_hash)
          end
          {
            name: name,
            included_columns:
                [{name: node_type.humanize}] +
                  @chart_attributes.map do |ro_chart_attribute|
                    {
                      name: ro_chart_attribute.display_name,
                      unit: ro_chart_attribute.unit,
                      tooltip: ro_chart_attribute.tooltip_text
                    }
                  end,
            rows: rows
          }
        end

        def data_row(group_totals_hash, node_type, node)
          node_id = node['node_id']
          totals_per_attribute = @flow_stats.
            flow_values_totals_for_attributes_into(
              @attributes,
              node_type,
              node_id
            )
          totals_hash = Hash[
            totals_per_attribute.map do |total|
              [total['name'], total['value']]
            end
          ]
          totals_hash.each do |key, value|
            if group_totals_hash[key]
              group_totals_hash[key] += value
            else
              group_totals_hash[key] = value
            end
          end
          {
            values:
              [
                {
                  id: node_id,
                  value: node['name']
                }
              ] +
                @attributes.map do |attribute|
                  attribute_total = totals_hash[attribute.name]
                  {value: attribute_total} if attribute_total
                end
          }
        end

        def totals_row(group_totals_hash)
          {
            is_total: true,
            values:
              @attributes.map do |attribute|
                attribute_total = group_totals_hash[attribute.name]
                {value: attribute_total} if attribute_total
              end
          }
        end
      end
    end
  end
end
