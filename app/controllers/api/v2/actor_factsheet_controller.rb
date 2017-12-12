module Api
  module V2
    class ActorFactsheetController < ApiController
      def actor_data
        context_id = params[:context_id]

        context = if context_id.present?
                    Context.find(context_id)
                  else
                    Context.find_by(is_default: true)
                  end

        raise ActionController::ParameterMissing, 'Required context_id missing' if context.nil?

        year = if params[:year].present?
                 params[:year].to_i
               else
                 context.default_year
               end
        raise ActionController::ParameterMissing, 'Required year missing' if year.nil?

        node_id = params[:node_id]

        raise ActionController::ParameterMissing, 'Required node_id missing' if node_id.nil?

        node = Node.actor_nodes.find(node_id)

        @result = ActorAttributes.new(context, year, node).result

        render json: @result
      end
    end
  end
end
