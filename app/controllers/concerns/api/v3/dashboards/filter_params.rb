module Api
  module V3
    module Dashboards
      module FilterParams
        extend ActiveSupport::Concern

        private

        def chart_params
          {
            country_id: string_to_int(params[:country_id]),
            commodity_id: string_to_int(params[:commodity_id]),
            start_year: string_to_int(params[:start_year]),
            end_year: string_to_int(params[:end_year]),
            cont_attribute_id: string_to_int(params[:cont_attribute_id]),
            ncont_attribute_id: string_to_int(params[:ncont_attribute_id]),
            sources_ids: cs_string_to_int_array(params[:sources_ids]),
            companies_ids: cs_string_to_int_array(params[:companies_ids]),
            destinations_ids: cs_string_to_int_array(params[:destinations_ids]),
            node_type_id: string_to_int(params[:node_type_id]),
            top_n: string_to_int(params[:top_n]),
            single_filter_key: params[:single_filter_key]
          }
        end

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
