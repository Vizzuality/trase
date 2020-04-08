module Api
  module V3
    module CountryProfiles
      class CommodityTotals
        include Api::V3::Profiles::AttributesInitializer

        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @param year [Integer]
        # @param profile_options [Hash]
        # @option profile_options [String] profile_type
        # @option profile_options [String] chart_identifier
        def initialize(node, year, profile_options)
          @node = node
          @year = year
          @nodes_with_flows = Api::V3::Readonly::NodeWithFlows.
            select('nodes_with_flows.*, commodities.name AS commodity').
            joins(:commodity).
            where(id: node.id)
          quant_dictionary = Dictionary::Quant.instance
          # Assumption: Volume is a special quant which always exists
          @volume_attribute = quant_dictionary.get('Volume')
          unless @volume_attribute.present?
            raise ActiveRecord::RecordNotFound.new 'Quant Volume not found'
          end
          @context = node.context
          @profile_type = profile_options[:profile_type]
          @chart_identifier = profile_options[:chart_identifier]
          initialize_chart_config(@profile_type, nil, @chart_identifier)
        end

        def call
          {
            name: @chart_config.chart.title,
            included_columns: included_columns,
            rows: rows
          }
        end

        private

        def included_columns
          []
        end

        def rows
          @nodes_with_flows.map do |node_with_flows|
            {
              name: node_with_flows['commodity'],
              values: [
                0, # TODO:
                production_value(node_with_flows.commodity_id),
                0, # TODO:
                0 # TODO:
              ]
            }
          end
        end

        def production_value(commodity_id)
          production_values[commodity_id]
        end

        def production_values
          return @production_values if defined? @production_values

          path_conditions = @nodes_with_flows.map do |node_with_flows|
            ApplicationRecord.sanitize_sql_for_conditions(
              [
                "flows.context_id = ? AND flows.path[?] = ?",
                node_with_flows.context_id,
                node_with_flows.column_position + 1,
                node_with_flows.id
              ]
            )
          end.join(' OR ')

          data = Api::V3::FlowQuant.
            select('contexts.commodity_id, SUM(value) AS total').
            from('partitioned_flow_quants flow_quants').
            joins(flow: :context).
            where(path_conditions).
            where('flows.year' => @year).
            group('contexts.commodity_id')

          @production_values = Hash[
            data.map { |fq| [fq['commodity_id'], fq['total']] }
          ]
        end
      end
    end
  end
end
