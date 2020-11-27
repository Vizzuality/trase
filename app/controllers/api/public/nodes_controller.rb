module Api
  module Public
    class NodesController < BaseController
      skip_before_action :load_context

      def data
        ensure_required_param_present(:id)
        ensure_required_param_present(:year)

        @result = Api::Public::Node::Filter.new(filter_params).call

        render json: @result,
               root: 'data',
               serializer: Api::Public::Node::NodeSerializer
      end

      private

      def filter_params
        {
          id: params[:id],
          year: params[:year]
        }
      end

      def tracking_params
        {nodes_ids: [params[:id]], start_year: params[:year]}
      end
    end
  end
end
