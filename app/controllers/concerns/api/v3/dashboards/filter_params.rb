module Api
  module V3
    module Dashboards
      module FilterParams
        extend ActiveSupport::Concern

        private

        def filter_params
          {
            countries_ids: cs_string_to_int_array(params[:countries_ids]),
            commodities_ids: cs_string_to_int_array(params[:commodities_ids]),
            sources_ids: cs_string_to_int_array(params[:sources_ids]),
            companies_ids: cs_string_to_int_array(params[:companies_ids]),
            destinations_ids: cs_string_to_int_array(params[:destinations_ids]),
            node_types_ids: cs_string_to_int_array(params[:node_types_ids])
          }
        end

        def string_to_int(str)
          str&.to_i
        end

        def cs_string_to_int_array(str)
          str&.split(',')&.map(&:to_i) || []
        end
      end
    end
  end
end
