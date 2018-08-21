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
          chart = initialize_chart(:actor, nil, :companies_sourcing)
          @chart_attributes, @attributes = initialize_attributes(chart)
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
            @attributes
          )

          attribute_totals_hash = attribute_totals_hash(
            production_totals, attribute_totals
          )

          exports = production_totals.map do |total|
            node_id = total['node_id']
            {
              name: total['name'],
              id: node_id,
              y: total['value'].to_f / value_divisor,
              x: attribute_totals_hash[node_id]
            }
          end

          {
            dimension_y: {
              name: 'Trade Volume', unit: unit
            },
            dimensions_x: @chart_attributes.map do |chart_attribute|
              {name: chart_attribute.display_name, unit: chart_attribute.unit}
            end,
            companies: exports
          }
        end

        private

        def attribute_totals_hash(production_totals, attribute_totals)
          attribute_totals_hash = {}
          attribute_indexes = Hash[
            @chart_attributes.map.each_with_index do |attribute, idx|
              [attribute.name, idx]
            end
          ]
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
          attribute_totals_hash
        end
<<<<<<< HEAD

        def attributes_list
          [
            {
              name: 'Land use',
              unit: 'ha',
              attribute_type: 'quant',
              attribute_name: 'SOY_AREA_'
            },
            {
              name: 'Territorial Deforestation',
              unit: 'ha',
              attribute_type: 'quant',
              attribute_name: 'DEFORESTATION_V2'
            },
            {
              name: 'Soy deforestation',
              unit: 'ha',
              attribute_type: 'quant',
              attribute_name: 'SOY_DEFORESTATION_5_YEAR_ANNUAL'
            }
          ]
        end
=======
>>>>>>> Serving actor exporting companies from dynamic configuration
      end
    end
  end
end
