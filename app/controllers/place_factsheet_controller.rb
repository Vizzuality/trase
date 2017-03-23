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

    single_quant_values = NodeQuant
                               .select('quants.name, quants.unit, quants.unit_type, quants.frontend_name, quants.tooltip_text, node_quants.value')
                               .joins(:quant)
                               .joins(:node)
                               .where('place_factsheet IS TRUE AND (place_factsheet_temporal IS NULL OR place_factsheet_temporal IS FALSE) AND nodes.node_id = :node_id', {:node_id => node_id})
                               .as_json

    single_qual_values = NodeQual
                              .select('quals.name, NULL as unit, NULL as unit_type, quals.frontend_name, quals.tooltip_text, node_quals.value')
                              .joins(:qual)
                              .joins(:node)
                              .where('place_factsheet IS TRUE AND (place_factsheet_temporal IS NULL OR place_factsheet_temporal IS FALSE) AND nodes.node_id = :node_id', {:node_id => node_id})
                              .as_json

    single_ind_values = NodeInd
                             .select('inds.name, inds.unit, inds.unit_type, inds.frontend_name, inds.tooltip_text, node_inds.value')
                             .joins(:ind)
                             .joins(:node)
                             .where('place_factsheet IS TRUE AND (place_factsheet_temporal IS NULL OR place_factsheet_temporal IS FALSE) AND nodes.node_id = :node_id', {:node_id => node_id})
                             .as_json

    # @temporal_quants = Quant
    #               .select('quants.name, quants.frontend_name, quants.tooltip_text, quants.quant_id, node_quants.value,  node_quants.year')
    #               .joins(node_quants: [:node])
    #               .where('place_factsheet IS TRUE AND place_factsheet_temporal IS TRUE AND nodes.node_id = :node_id', { :node_id => node_id })

    @single_value_metrics = single_quant_values
    # @single_value_metrics = @single_quant_values.concat(@single_qual_values.concat(@single_ind_values))

    @result = {
        type: node.node_type.node_type,
        name: node.name,
        geo_id: node.geo_id,
        single_value_metrics: @single_value_metrics
        # temporal_quants: @temporal_quants
    }

    family = node.get_parents

    family.each do |node|
      @result[node.node_type.node_type.downcase + '_name'] = node.name
      @result[node.node_type.node_type.downcase + '_geo_id'] = node.geo_id
    end

    render json: @result
  end
end
