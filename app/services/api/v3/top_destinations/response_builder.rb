module Api
  module V3
    module TopDestinations
      class ResponseBuilder
        attr_reader :top_destinations

        def initialize(commodity_id, contexts_ids, params)
          @commodity_id = commodity_id
          @contexts_ids = contexts_ids
          initialize_params(params)
          initialize_errors
        end

        def call
          initialize_top_destinations
          {
            targetDestinations: @top_destinations.map do |top_destination|
              {
                id: top_destination['node_id'],
                name: top_destination['name'],
                value: top_destination['value']
              }
            end
          }
        end

        private

        def initialize_params(params)
          @year_start = initialize_param(params, :year_start) || Date.today.year
          @year_end = initialize_param(params, :year_end) || @year_start
          @limit = params[:limit]&.to_i || 10

          # Assumption: Volume is a special quant which always exists
          @volume_attribute = Dictionary::Quant.instance.get('Volume')
          raise 'Quant Volume not found' unless @volume_attribute.present?
        end

        def initialize_param(params, symbol)
          raise "Parameter #{symbol} missing" unless params.key?(symbol)
          params[symbol]
        end

        def initialize_top_destinations
          if @commodity_id
            top_destinations_list =
              Api::V3::Profiles::TopDestinationsForCommodityList.new(
                @commodity_id,
                year_start: @year_start,
                year_end: @year_end
              )
          else
            top_destinations_list =
              Api::V3::Profiles::TopDestinationsForContextsList.new(
                @contexts_ids,
                year_start: @year_start,
                year_end: @year_end
              )
          end

          @top_destinations = top_destinations_list.
            sorted_list(@volume_attribute, limit: @limit)
          @all_destinations_total = top_destinations_list.
            total(@volume_attribute, limit: @limit)
        end

        def initialize_errors
          @errors = []
          unless @year_start && @year_end
            @errors << 'Both start and end date not given'
          end
          if @year_start && @year_end && @year_start > @year_end
            @errors << 'Year start can not be higher than year end'
          end
          if @commodity_id && (@contexts_ids || []).any?
            @errors << 'Either commodity or contexts but not both'
          end
        end
      end
    end
  end
end
