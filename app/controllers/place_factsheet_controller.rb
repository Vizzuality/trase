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

    # result = Quant
    #              .where('place_factsheet IS TRUE')

    result = {
        :column_name => node.node_type.node_type,
        :country_name => context.country.name,
        :country_geoId => node.geo_id[0..1]
    }

    if node.node_type.node_type.eql? 'BIOME'
      result[:biome_name] = node.name
      result[:biome_geoId] = node.geo_id
    end


    if node.node_type.node_type.eql? 'STATE'
      result[:state_name] = node.name
      result[:state_geoId] = node.geo_id
    end

    if ['MUNICIPALITY', 'LOGISTICS HUB'].include? node.node_type.node_type
      result[:municip_name] = node.name
      result[:municip_geoId] = node.geo_id
    # biome_name = place_quals['BIOME'][0]
    #   result['biome_name'] = biome_name
    #   result['biome_geoId'] = get_biome_geo_id(biome_name, connection)
    # state_name = place_quals['STATE'][0]
    #   result['state_name'] = state_name
    #   result['state_geoId'] = get_state_geo_id(state_name, connection)
    # if 'AREA_KM2' in place_quants:
    #     data['area'] = place_quants['AREA_KM2'][0]
    # if 'SOY_AREAPERC' in place_inds:
    #     data['soy_farmland'] = place_inds['SOY_AREAPERC'][0] / 100
    # if 'PERC_FARM_GDP' in place_inds:
    #     data['farming_GDP'] = place_inds['PERC_FARM_GDP'][0]
    end

    render json: result
  end
end
