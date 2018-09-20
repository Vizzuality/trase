module Api
  module V3
    module Dashboards
      class CompaniesController < ApiController
        include FilterParams
        include PaginationHeaders
        skip_before_action :load_context

        def index
          @companies = FilterCompanies.new(filter_params).call.
            page(current_page).
            without_count
          set_link_headers(@companies)

          render json: @companies,
                 root: 'data',
                 each_serializer: Api::V3::Dashboards::CompanySerializer
        end
      end
    end
  end
end
