class PlaceFactsheetController < ApplicationController
  def place_data
    context_id = params[:context_id]

    context = if context_id.present?
      Context.find(context_id)
    else
      Context.find_by(is_default: true)
    end

    node_id = params[:node_id]

    raise ActionController::ParameterMissing, 'Required node_id missing' if node_id.nil?

    node = Node.place_nodes.find(node_id)

    render json: PlaceAttributes.new(context, node).result
  end
end
