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
          @activity =
            if @node.node_type == NodeTypeName::COUNTRY_OF_PRODUCTION
              :exporter
            else
              :importer
            end
          @nodes_with_flows = Api::V3::Readonly::NodeWithFlows.
            select('nodes_with_flows.*, commodities.name AS commodity').
            joins(:commodity).
            where(id: node.id)
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

        def quant_dictionary
          Dictionary::Quant.instance
        end

        def included_columns
          trade_volume_ranking = Api::V3::CountryProfiles::ExternalAttributesList.instance.call('com_trade.quantity.rank', substitutions).
            except(:short_name).
            merge(
              name: "World #{trade_flow} ranking",
              unit: nil,
              tooltip: "World #{trade_flow} ranking by netweight"
            )
          trade_volume_value = Api::V3::CountryProfiles::ExternalAttributesList.instance.call('com_trade.quantity.value', substitutions).
            except(:short_name).
            merge(
              name: "#{trade_flow}s".capitalize,
              unit: 't', # needs conversion as it comes in kg from the ComTrade API
              tooltip: 'Netweight (tonnes)'
            )
          trade_value = Api::V3::CountryProfiles::ExternalAttributesList.instance.call('com_trade.value.value', substitutions).
            except(:short_name).
            merge(name: 'Value')

          [
            trade_volume_ranking,
            {
              name: 'Production',
              unit: @volume_attribute.unit || 't',
              unit_position: 'suffix',
              tooltip: @volume_attribute.tooltip_text || 'Production (tonnes)'
            },
            trade_volume_value,
            trade_value
          ]
        end

        def rows
          @nodes_with_flows.map do |node_with_flows|
            @external_attribute_value = ExternalAttributeValue.new(
              @node.geo_id,
              @year,
              @activity,
              node_with_flows.commodity_id
            )
            quantity = @external_attribute_value.call('com_trade.quantity.value')&.value
            quantity = quantity.to_f / 1000 if quantity.present?
            {
              name: node_with_flows['commodity'],
              values: [
                @external_attribute_value.call('com_trade.quantity.rank')&.value,
                production_values[node_with_flows['commodity']],
                quantity,
                @external_attribute_value.call('com_trade.value.value')&.value
              ]
            }
          end.sort { |a, b| b[:values][2].to_f <=> a[:values][2].to_f }.reject { |r| r[:values].compact.empty? }
        end

        def production_values
          return @production_values if defined? @production_values

          @production_values = {}
          preloaded_values = Api::V3::NodeAttributeValuesPreloader.new(@node, @year)
          @nodes_with_flows.each do |node_with_flows|
            commodity_name = node_with_flows['commodity']

            # find quant based on commodity name
            production_quant = production_quants[commodity_name]
            next unless production_quant.present?

            preloaded_value = preloaded_values.get(production_quant.simple_type, production_quant.id)
            @production_values[commodity_name] = preloaded_value&.value
          end
          @production_values
        end

        def production_quants
          return @production_quants if defined? @production_quants

          commodity_names = @nodes_with_flows.map { |node| node['commodity'] }
          quant_names = commodity_names.map do |commodity_name|
            "#{commodity_name.upcase}_TN"
          end
          @production_quants = {}
          quant_names.each.with_index do |quant_name, idx|
            quant = quant_dictionary.get(quant_name)
            next if quant.nil?

            @production_quants[commodity_names[idx]] = quant
          end
          @production_quants
        end

        def substitutions
          {trade_flow: trade_flow}
        end

        def trade_flow
          @activity.to_s.sub(/er$/, '')
        end
      end
    end
  end
end
