module Api
  module Private
    class ContextNodeTypePropertySerializer < ActiveModel::Serializer
      attributes :column_group, :is_default, :is_geo_column, :is_choropleth_disabled, :role, :prefix, :geometry_context_node_type_id, :is_visible
    end
  end
end
