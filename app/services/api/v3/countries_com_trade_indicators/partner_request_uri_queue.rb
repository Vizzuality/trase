module Api
  module V3
    module CountriesComTradeIndicators
      class PartnerRequestUriQueue < WorldRequestUriQueue
        def initialize
          parameters = {
            REPORTER_PARAMETER => reporter_codes,
            COMMODITY_CODES_PARAMETER => commodity_codes,
            YEAR_PARAMETER => years
          }
          @request_queue = initialize_request_queue(parameters)
        end

        def fixed_params
          {
            type: 'C', # Commodities (merchandise trade data)
            freq: 'A', # Annual
            px: 'HS', # HS Harmonized System (HS), as reported
            rg: '1', # trade regime (imports)
            p: 'all', # partner
            fmt: 'json'
          }
        end

        private

        def estimated_resultset_size(parameter_constraints)
          # estimate the number of results
          parameter_constraints.values.map { |e| e[:size] }.inject(100, :*)
        end

        def reporter_codes
          trase_country_iso2s = Api::V3::Node.where(
            node_type_id: Api::V3::NodeType.where(
              name: [NodeTypeName::COUNTRY, NodeTypeName::COUNTRY_OF_PRODUCTION]
            )
          ).select(:geo_id).distinct.pluck(:geo_id)

          country_codes =
            Api::V3::CountriesComTradeIndicators::CountryCodes.new

          trase_country_iso2s.map do |iso2|
            country = country_codes.lookup_by_iso2(iso2)
            next unless country

            country[:m49]
          end.compact.sort
        end
      end
    end
  end
end
