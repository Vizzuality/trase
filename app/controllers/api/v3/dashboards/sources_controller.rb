module Api
  module V3
    module Dashboards
      class SourcesController < ApiController
        include FilterParams
        include PaginationHeaders
        skip_before_action :load_context

        def index
          ensure_required_param_present(:countries_ids)
          @sources = FilterSources.new(filter_params).call.
            page(current_page).
            without_count
          set_link_headers(@sources)

          render json: @sources,
                 root: 'data',
                 meta: FilterSourcesMeta.new(filter_params.slice(:countries_ids, :commodities_ids)).call,
                 each_serializer: Api::V3::Dashboards::SourceSerializer
        end
      end
    end
  end
end
