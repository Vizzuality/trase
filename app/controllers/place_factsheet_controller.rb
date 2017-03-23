class PlaceFactsheetController < ApplicationController
  def place_data

    context_id = params[:context_id]

    if (not context_id.nil?)
      context = Context.find(context_id)
    else
      context = Context.find_by(:is_default => true)
    end

    node_id = params[:node_id]

    raise ActionController::ParameterMissing, 'Required node_id missing' if node_id.nil?

    node = Node.find(node_id);

    # @result = Quant
    #              .where('place_factsheet IS TRUE')

    @result = {
        type: node.node_type.node_type,
        name: node.name,
        geo_id: node.geo_id
    }

    family = node.get_parents()

    family.each do |node|
      @result[node.node_type.node_type.downcase + '_name'] = node.name
      @result[node.node_type.node_type.downcase + '_geo_id'] = node.geo_id
    end

    render json: @result
  end
end
