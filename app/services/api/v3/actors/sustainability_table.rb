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
          initialize_attributes(attributes_list)
          initialize_flow_stats_for_node
        end

        def call
          [
            {group_name: 'Municipalities', node_type: NodeTypeName::MUNICIPALITY},
            {group_name: 'Biomes', node_type: NodeTypeName::BIOME, is_total: true}
          ].map do |group|
            sustainability_for_group(group[:group_name], group[:node_type], group[:is_total])
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
          rows << totals_row(group_totals_hash) if include_totals
          {
            name: name,
            included_columns:
                [{name: node_type.humanize}] +
                  @attributes.map do |attribute_hash|
                    {
                      name: attribute_hash[:name] || attribute_hash[:attribute].display_name,
                      unit: attribute_hash[:attribute].unit,
                      tooltip: attribute_hash[:attribute][:tooltip_text]
                    }
                  end,
            rows: rows
          }
        end

        def data_row(group_totals_hash, node_type, node)
          totals_per_attribute = @flow_stats.flow_values_totals_for_attributes_into(
            @attributes.map { |a| a[:attribute] }, node_type, node['node_id']
          )
          totals_hash = Hash[
            totals_per_attribute.map { |t| [t['name'], t['value']] }
          ]
          totals_hash.each do |k, v|
            if group_totals_hash[k]
              group_totals_hash[k] += v
            else
              group_totals_hash[k] = v
            end
          end
          {
            values:
              [
                {
                  id: node['node_id'],
                  value: node['name']
                }
              ] +
                @attributes.map do |attribute_hash|
                  if totals_hash[attribute_hash[:attribute_name]]
                    {value: totals_hash[attribute_hash[:attribute_name]]}
                  end
                end
          }
        end

        def totals_row(group_totals_hash)
          {
            is_total: true,
            values: @attributes.map do |attribute_hash|
              if group_totals_hash[attribute_hash[:attribute_name]]
                {value: group_totals_hash[attribute_hash[:attribute_name]]}
              end
            end
          }
        end

        def attributes_list
          [
            {
              attribute_type: 'quant',
              attribute_name: 'DEFORESTATION_V2'
            },
            {
              attribute_type: 'quant',
              attribute_name: 'POTENTIAL_SOY_DEFORESTATION_V2'
            },
            {
              name: 'Soy deforestation',
              attribute_type: 'quant',
              attribute_name: 'AGROSATELITE_SOY_DEFOR_'
            }
          ]
        end
      end
    end
  end
end
