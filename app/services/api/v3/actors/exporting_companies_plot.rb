module Api
  module V3
    module Actors
      class ExportingCompaniesPlot
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
        end

        def call
          unit = @volume_attribute.unit
          value_divisor = 1
          if unit.casecmp('tn').zero?
            unit = 'kt'
            value_divisor = 1000
          end

          stats = Api::V3::Profiles::FlowStatsForNodeType.new(
            @context, @year, @node.node_type.name
          )

          production_totals = stats.nodes_with_flows_totals(@volume_attribute)
          attribute_totals = stats.nodes_with_flows_totals_for_attributes(
            @attributes.map { |attribute_hash| attribute_hash[:attribute] }
          )

          attribute_indexes = Hash[
            @attributes.map.each_with_index do |attribute_hash, idx|
              [attribute_hash[:attribute_name], idx]
            end
          ]

          attribute_totals_hash = {}
          production_totals.each do |total|
            attribute_totals_hash[total['node_id']] ||= Array.new(
              @attributes.size
            )
          end
          attribute_totals.each do |total|
            attribute_idx = attribute_indexes[total['attribute_name']]
            node_id = total['node_id']
            if attribute_totals_hash.key?(node_id)
              attribute_totals_hash[node_id][attribute_idx] = total['value']
            end
          end

          exports = production_totals.map do |total|
            {
              name: total['name'],
              id: total['node_id'],
              y: total['value'].to_f / value_divisor,
              x: attribute_totals_hash[total['node_id']]
            }
          end

          {
            dimension_y: {
              name: 'Trade Volume', unit: unit
            },
            dimensions_x: @attributes.map do |attribute_hash|
              attribute_hash.slice(:name, :unit)
            end,
            companies: exports
          }
        end

        private

        def attributes_list
          [
            {
              name: 'Land use',
              unit: 'ha',
              attribute_type: 'quant',
              attribute_name: 'LAND_USE'
            },
            {
              name: 'Territorial Deforestation',
              unit: 'ha',
              attribute_type: 'quant',
              attribute_name: 'DEFORESTATION_V2'
            },
            {
              name: 'Maximum soy deforestation',
              unit: 'ha',
              attribute_type: 'quant',
              attribute_name: 'POTENTIAL_SOY_DEFORESTATION_V2'
            },
            {
              name: 'Soy related deforestation',
              unit: 'ha',
              attribute_type: 'quant',
              attribute_name: 'AGROSATELITE_SOY_DEFOR_'
            },
            {
              name: 'Loss of biodiversity',
              attribute_type: 'quant',
              attribute_name: 'BIODIVERSITY'
            },
            {
              name: 'Land-based emissions',
              unit: 't',
              attribute_type: 'quant',
              attribute_name: 'GHG_'
            }
          ]
        end
      end
    end
  end
end
