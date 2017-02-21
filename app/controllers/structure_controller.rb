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
                 .select('context.id, countries.name as country_name, commodities.name as commodity_name, years')
                 .joins(:country)
                 .joins(:commodity)
                 .all()

    render json: result, root: 'data', each_serializer: GetContextsSerializer
  end
end
