ActiveAdmin.register Api::V3::ContextNodeTypeProperty, as: 'ContextNodeTypeProperty' do
  menu parent: 'Yellow Tables'

  permit_params :context_node_type_id, :column_group, :is_default,
                :is_geo_column, :is_choropleth_disabled

  form do |f|
    f.semantic_errors
    inputs do
      input :context_node_type, as: :select, required: true,
        collection: Api::V3::ContextNodeType.select_options
      input :column_group, as: :select, required: true,
        collection: Api::V3::ContextNodeTypeProperty::COLUMN_GROUP,
        hint: object.class.column_comment('column_group')
      input :is_default, as: :boolean, required: true,
        hint: object.class.column_comment('is_default')
      input :is_geo_column, as: :boolean, required: true,
        hint: object.class.column_comment('is_geo_column')
      input :is_choropleth_disabled, as: :boolean, required: true,
        hint: object.class.column_comment('is_choropleth_disabled')
    end
    f.actions
  end

  index do
    column('Country') { |property| property.context_node_type&.context&.country&.name }
    column('Commodity') { |property| property.context_node_type&.context&.commodity&.name }
    column('Node Type') { |property| property.context_node_type&.node_type&.name }
    column :column_group
    column :is_default
    column :is_geo_column
    column :is_choropleth_disabled
    actions
  end

  filter :context_node_type, collection: -> { Api::V3::ContextNodeType.
    select_options }
end
