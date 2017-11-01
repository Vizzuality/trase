class StructureController < ApplicationController
  def get_columns
    @node_types = NodeType.
      joins(:context_nodes).
      select('node_types.node_type_id, column_position as position, column_group as group, node_types.node_type as name, is_default, is_geo_column as is_geo, context_nodes.profile_type as profile_type').
      where('context_nodes.context_id = :context_id', context_id: @context.id).
      order('context_nodes.column_position ASC')

    render json: @node_types, root: 'data', each_serializer: GetColumnsSerializer
  end

  def get_contexts
    @contexts = Context.
      eager_load(:country, :commodity, :context_resize_bies, :context_recolor_bies, context_filter_bies: [node_type: [:nodes]]).
      all

    render json: @contexts, root: 'data', each_serializer: GetContextsSerializer
  end
end
