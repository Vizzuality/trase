module Api
  module V3
    module CountriesComTradeIndicators
      class WorldRequestUriQueue
        API_URL = 'https://comtrade.un.org/api/get'.freeze

        COMMODITY_CODES_PARAMETER = 'cc'.freeze
        YEAR_PARAMETER = 'ps'.freeze
        REPORTER_PARAMETER = 'r'.freeze
        TRADE_REGIME_PARAMETER = 'rg'.freeze
        PARAMETER_LIMITS = {
          COMMODITY_CODES_PARAMETER => 20,
          YEAR_PARAMETER => 5,
          REPORTER_PARAMETER => 5
        }
        RESULTSET_LIMIT = 10_000

        def initialize
          parameters = {
            COMMODITY_CODES_PARAMETER => commodity_codes,
            YEAR_PARAMETER => years,
            TRADE_REGIME_PARAMETER => ['1', '2'] # imports & exports
          }
          @request_queue = initialize_request_queue(parameters)
        end

        def call
          @request_queue
        end

        def fixed_params
          {
            type: 'C', # Commodities (merchandise trade data)
            freq: 'A', # Annual
            px: 'HS', # HS Harmonized System (HS), as reported
            r: 'all', # reporter
            p: 0, # partner area World
            fmt: 'json'
          }
        end

        private

        # Optimise the number of requests fired to retrieve data
        # while observing the limit on returned resultset size
        def initialize_request_queue(parameters)
          parameter_constraints = initialize_constraints(parameters)
          parameter_constraints = adjust_constraints(parameter_constraints)
          formatted_parameters = format_parameters(parameters, parameter_constraints)

          formatted_parameters.map do |params|
            URI(API_URL + '?' + fixed_params.merge(params).to_query)
          end
        end

        # Initializes an object that describes the size of value lists per parameter
        def initialize_constraints(parameters)
          # start by assuming we can use max parameter limits
          parameter_constraints = {}
          parameters.each do |param, values_list|
            param_max = PARAMETER_LIMITS[param]
            values_list_length = values_list.length
            parameter_constraints[param] =
              if param_max && param_max < values_list_length
                {size: param_max, name: param}
              else
                {size: values_list_length, name: param}
              end
          end
          parameter_constraints
        end

        def adjust_constraints(parameter_constraints)
          sorted_parameters = parameter_constraints.values.sort_by { |e| -e[:size] }

          # estimate the number of results
          estimated = estimated_resultset_size(parameter_constraints)
          while estimated > RESULTSET_LIMIT
            # puts "estimated: #{estimated}, limit: #{RESULTSET_LIMIT}"
            # pick a param that can be further split and decrease list size
            param = sorted_parameters.find { |e| e[:size] > 1 }
            break if param.nil? # nothing left to optimise

            parameter_constraints[param[:name]][:size] = (parameter_constraints[param[:name]][:size].to_f/2).ceil
            estimated = estimated_resultset_size(parameter_constraints)
          end

          # raise an exception in case the optimisation was not possible
          if estimated > RESULTSET_LIMIT
            error = ComTradeError.new(
              'Impossible to parametrise request without exceeding maximum resultset size. ' +
              "Estimated #{estimated} results with the following parameter list constraints:" +
              parameter_constraints.inspect
            )
            raise error
          end
          parameter_constraints
        end

        def format_parameters(parameters, parameter_constraints)
          formatted_parameters = [{}]
          parameters.each do |param, values_list|
            new_formatted_parameters = []
            formatted_parameters.each do |params|
              values_list.each_slice(parameter_constraints[param][:size]) do |slice|
                new_formatted_parameters << params.merge(param => slice.join(','))
              end
            end
            formatted_parameters = new_formatted_parameters
          end
          formatted_parameters
        end

        def estimated_resultset_size(parameter_constraints)
          # estimate the number of results
          # 250 - number of countries
          parameter_constraints.values.map { |e| e[:size] }.inject(250, :*)
        end

        def commodity_codes
          result = []
          commodity_codes =
            Api::V3::CountriesComTradeIndicators::CommodityCodes.new
          Api::V3::Commodity.all.pluck(:id).each do |commodity_id|
            commodities = commodity_codes.lookup_by_trase_id(commodity_id)
            next unless commodities

            commodities.each do |commodity|
              result += commodity[:com_trade_codes]
            end
          end
          result.uniq
        end

        def years
          years = Api::V3::Flow.
            select(:year).
            distinct.
            pluck(:year)
          (years.min..years.max).to_a
        end
      end
    end
  end
end
