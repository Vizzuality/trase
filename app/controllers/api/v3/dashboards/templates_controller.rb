module Api
  module V3
    module Dashboards
      class TemplatesController < ApiController
        skip_before_action :load_context

        def index
          dashboard_templates = Api::V3::DashboardTemplate.
            includes(
              :countries,
              :commodities,
              :companies_mv,
              :destinations_mv,
              :sources_mv,
              sources: :node_type
            )

          render json: dashboard_templates,
                 root: "data",
                 each_serializer: Api::V3::Dashboards::TemplateSerializer
        end
      end
    end
  end
end
