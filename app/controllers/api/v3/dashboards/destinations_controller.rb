module Api
  module V3
    module Dashboards
      class DestinationsController < ApiController
        include FilterParams
        include PaginationHeaders
        skip_before_action :load_context

        def index
          @destinations = FilterDestinations.new(filter_params).call.
            page(current_page).
            without_count
          set_link_headers(@destinations)

          render json: @destinations,
                 root: 'data',
                 each_serializer: Api::V3::Dashboards::DestinationSerializer
        end
      end
    end
  end
end
