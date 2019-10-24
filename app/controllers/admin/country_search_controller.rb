module Admin
  class CountrySearchController < ::Api::ApiController
    skip_before_action :load_context

    def index
      @q = Api::V3::Readonly::Dashboards::Country.ransack(params[:q])
      @nodes = @q.result.order(:name).page(params[:page]).to_a.uniq

      render json: @nodes, root: 'data',
             each_serializer: Admin::CountrySearchSerializer
    end
  end
end
