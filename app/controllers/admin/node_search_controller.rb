module Admin
  class NodeSearchController < ::Api::V3::ApiController
    skip_before_action :load_context

    def index
      @q = Api::V3::Node.ransack(params[:q])
      @nodes = @q.result.page(params[:page])

      render json: @nodes, root: 'data',
             each_serializer: Admin::NodeSearchSerializer
    end
  end
end
