module Api
  module V2
    class PlaceFactsheetController < ApiController
      def place_data
        context_id = params[:context_id]

        context = if context_id.present?
                    Context.find(context_id)
                  else
                    Context.find_by(is_default: true)
                  end

        raise ActionController::ParameterMissing, 'Required context_id missing' if context.nil?

        year = params[:year].to_i || context.default_year

        raise ActionController::ParameterMissing, 'Required year missing' if year.nil?

        node_id = params[:node_id]

        raise ActionController::ParameterMissing, 'Required node_id missing' if node_id.nil?

        node = Node.place_nodes.find(node_id)

        @result = PlaceAttributes.new(context, year, node).result

        render json: @result
      end
    end
  end
end
