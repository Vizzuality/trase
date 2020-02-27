module Api
  module V3
    module Actors
      class ExportingCompaniesPlot
        include Api::V3::Profiles::AttributesInitializer

        # @param context [Api::V3::Context]
        # @param node [Api::V3::Node]
        # @year [Integer]
        # rubocop:disable Metrics/MethodLength
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
          # rubocop:disable Style/GuardClause
          unless @chart_config.attributes.any?
            raise ActiveRecord::RecordNotFound.new 'No attributes found'
          end
          # rubocop:enable Style/GuardClause
        end
        # rubocop:enable Metrics/MethodLength

        def call
          stats = Api::V3::Profiles::FlowStatsForNodeType.new(
            @context, @year, @node.node_type.name
          )
          production_totals = stats.nodes_with_flows_totals(@volume_attribute)
          attributes_totals = @chart_config.attributes.map do |attribute|
            stats.nodes_with_flows_totals(attribute)
          end
          generate_response(production_totals, attributes_totals)
        end

        private

        def generate_response(production_totals, attributes_totals)
          unit = @volume_attribute.unit
          value_divisor = 1
          if unit.casecmp('tn').zero?
            unit = 'kt'
            value_divisor = 1000
          end
          values_map =
            initialize_production_values(production_totals, value_divisor)
          populate_attribute_values(attributes_totals, values_map)
          format_response(values_map, unit)
        end

        def initialize_production_values(production_totals, value_divisor)
          tmp_array = production_totals.map do |total|
            element = {
              name: total['name'],
              id: total['node_id'],
              y: total['value'].to_f / value_divisor,
              # this will be populated with values of chart attributes
              x: Array.new(@chart_config.attributes.length)
            }
            [element[:id], element]
          end
          Hash[tmp_array]
        end

        def populate_attribute_values(attributes_totals, values_map)
          attributes_totals.each.with_index do |attribute_totals, idx|
            attribute_totals.each do |total|
              node_id = total['node_id']
              next unless values_map.key?(node_id)

              values_map[node_id][:x][idx] = total['value']
            end
          end
          values_map
        end

        def format_response(values_map, unit)
          {
            dimension_y: {name: 'Trade Volume', unit: unit},
            dimensions_x: @chart_config.chart_attributes.
              map do |chart_attribute|
                {name: chart_attribute.display_name, unit: chart_attribute.unit}
              end,
            companies: values_map.values
          }
        end
      end
    end
  end
end
