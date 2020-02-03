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
          # Assumption: Volume is a special quant which always exists
          @volume_attribute = Dictionary::Quant.instance.get('Volume')
          unless @volume_attribute.present?
            raise ActiveRecord::RecordNotFound.new 'Quant Volume not found'
          end

          initialize_chart_config(:actor, nil, :actor_exporting_companies)
          unless @chart_config.attributes.any?
            raise ActiveRecord::RecordNotFound.new 'No attributes found'
          end
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
            @chart_config.attributes
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
            dimensions_x: @chart_config.chart_attributes.
              map do |chart_attribute|
                {name: chart_attribute.display_name, unit: chart_attribute.unit}
              end,
            companies: exports
          }
        end

        private

        def attribute_totals_hash(production_totals, attribute_totals)
          attribute_totals_hash = {}
          attribute_indexes = Hash[
            @chart_config.chart_attributes.map.
              each_with_index do |attribute, idx|
                [attribute.name, idx]
              end
          ]
          production_totals.each do |total|
            attribute_totals_hash[total['node_id']] ||= Array.new(
              @chart_config.attributes.size
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
      end
    end
  end
end
