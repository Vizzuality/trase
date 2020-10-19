module Api
  module V3
    class SankeyCardLinksController < ApiController
      include Api::V3::ParamHelpers

      skip_before_action :load_context

      before_action :set_filter_params, only: :index

      def index
        sankey_card_links = Api::V3::SankeyCardLinks::ResponseBuilder.new(
          @filter_params
        )
        sankey_card_links.call

        render json: {data: sankey_card_links.data, meta: sankey_card_links.meta}
      end

      private

      def ensure_required_params
        ensure_required_param_present(:level)

        if %w[2 3].include? params[:level]
          ensure_required_param_present(:commodity_id)
        end

        ensure_required_param_present(:country_id) if params[:level].include? '3'
      end

      def set_filter_params
        @filter_params = {
          country_id: params[:country_id],
          commodity_id: params[:commodity_id],
          levels: cs_string_to_int_array(params[:level])
        }
      end
    end
  end
end
