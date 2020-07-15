module Api
  module V3
    module CountryProfiles
      class ImportTrajectory < Api::V3::Profiles::StackedLineChart
        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @param year [Integer]
        # @param profile_options [Hash]
        # @option profile_options [String] profile_type
        # @option profile_options [String] chart_identifier
        def initialize(node, year, profile_options)
          super(
            node.context, node, year, profile_options
          )
          @activity =
            if @node.node_type == NodeTypeName::COUNTRY_OF_PRODUCTION
              :exporter
            else
              :importer
            end
        end

        private

        def fetch_years
          years = Api::V3::Readonly::CountriesComTradeAggregatedIndicator.
            where(iso2: @node.geo_id).
            select(:year).
            distinct.
            pluck(:year)
          @years = (years.min..years.max).to_a
        end

        def fetch_lines
          lines = []
          lines << {
            name: 'Production',
            legend_name: 'Production',
            legend_tooltip: 'Production',
            type: Api::V3::ChartAttribute::LINE,
            style: Api::V3::ChartAttribute::LINE_SOLID_RED,
            values: import_values
          }
          lines
        end

        def import_values
          years.map do |year|
            external_attribute_value = ExternalAttributeValue.new(
              @node.geo_id,
              year,
              @activity
            )
            external_attribute_value.call 'com_trade.value.value'
          end
        end
      end
    end
  end
end
