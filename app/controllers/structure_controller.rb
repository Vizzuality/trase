class StructureController < ApplicationController
  def get_columns

    result = NodeType
                 .joins(:context_nodes)
                 .select('node_types.node_type_id, column_position as position, column_group as group, node_types.node_type as name, is_default')
                 .where('context_nodes.context_id = :context_id', context_id: @context.id)
                 .order('context_nodes.column_position ASC')


    render json: result, root: 'data', each_serializer: GetColumnsSerializer
  end

  def get_contexts

    result = Context
                 .select('context.id, context.is_default, countries.name as country_name, commodities.name as commodity_name, years, default_year')
                 .joins(:country)
                 .joins(:commodity)
                 .all()
    
    result.values = {
        macro_geo: [1, 2, 3, 4, 5, 6],
        years: [2014, 2015],
        years_default: [2015],
        resize_by: %w[volume land_use fob soy_deforestation],
        resize_by_disabled: %w[land_based_emissions],
        resize_by_default: 'volume',
        recolor_by: %w[biome forest_500 zero_deforestation water_scarcity smallholders],
        recolor_by_disabled: %w[car]
    }

    render json: result, root: 'data', each_serializer: GetContextsSerializer
  end
end
