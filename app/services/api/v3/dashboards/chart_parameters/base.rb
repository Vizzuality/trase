module Api
  module V3
    module Dashboards
      module ChartParameters
        class Base
          attr_reader :country_id,
                      :commodity_id,
                      :context,
                      :start_year,
                      :end_year

          # @param params [Hash]
          # @option params [Integer] country_id
          # @option params [Integer] commodity_id
          # @option params [Integer] start_year
          # @option params [Integer] end_year
          def initialize(params)
            @country_id = params[:country_id]
            @commodity_id = params[:commodity_id]

            if @country_id && @commodity_id
              @context = Api::V3::Context.find_by_country_id_and_commodity_id!(
                @country_id, @commodity_id
              )
            end

            @start_year = params[:start_year]
            @end_year = params[:end_year]
          end

          private

          def single_year?
            @start_year.present? && @end_year.present? && @start_year == @end_year
          end

          def ncont_attribute?
            @ncont_attribute.present?
          end
        end
      end
    end
  end
end
