module Api
  module V3
    class NodesSearchController < ApiController
      skip_before_action :load_context

      def index
        @nodes = Api::V3::NodesSearch::Filter.new.
          call(params[:query], params[:context_id], params[:profile_only])

        render json: @nodes, root: "data",
               each_serializer: Api::V3::NodesSearch::NodeSerializer
      end
    end
  end
end
