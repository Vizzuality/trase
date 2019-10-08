module Api
  module V3
    module Dashboards
      module ChartParams
        extend ActiveSupport::Concern
        include Api::V3::ParamHelpers

        private

        def base_params
          {
            country_id: string_to_int(params[:country_id]),
            commodity_id: string_to_int(params[:commodity_id]),
            start_year: string_to_int(params[:start_year]),
            end_year: string_to_int(params[:end_year])
          }
        end

        def flow_values_chart_params
          base_params.merge(
            cont_attribute_id: string_to_int(params[:cont_attribute_id]),
            ncont_attribute_id: string_to_int(params[:ncont_attribute_id]),
            sources_ids: cs_string_to_int_array(params[:sources_ids]),
            # TODO: remove once dashboards_companies_mv retired
            companies_ids: cs_string_to_int_array(params[:companies_ids]),
            exporters_ids: cs_string_to_int_array(params[:exporters_ids]),
            importers_ids: cs_string_to_int_array(params[:importers_ids]),
            destinations_ids: cs_string_to_int_array(params[:destinations_ids]),
            excluded_sources_ids: cs_string_to_int_array(params[:excluded_sources_ids]),
            # TODO: remove once dashboards_companies_mv retired
            excluded_companies_ids: cs_string_to_int_array(params[:excluded_companies_ids]),
            excluded_exporters_ids: cs_string_to_int_array(params[:excluded_exporters_ids]),
            excluded_importers_ids: cs_string_to_int_array(params[:excluded_importers_ids]),
            excluded_destinations_ids: cs_string_to_int_array(params[:excluded_destinations_ids]),
            node_type_id: string_to_int(params[:node_type_id]),
            top_n: string_to_int(params[:top_n]),
            single_filter_key: params[:single_filter_key]
          )
        end

        def node_values_chart_params
          base_params.merge(
            cont_attribute_id: string_to_int(params[:cont_attribute_id]),
            node_id: string_to_int(params[:node_id])
          )
        end
      end
    end
  end
end
