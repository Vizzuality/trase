module Api
  module V3
    class LinkedNodesController < ApiController
      def index
        ensure_required_param_present(:nodes_ids)
        ensure_required_param_present(:target_column_id)
        ensure_required_param_present(:years)

        result = Api::V3::LinkedNodes::Filter.new(
          @context, params[:nodes_ids], params[:target_column_id].to_i, params[:years]
        ).result

        render json: result, root: "nodes",
               each_serializer: Api::V3::LinkedNodeSerializer
      end
    end
  end
end
