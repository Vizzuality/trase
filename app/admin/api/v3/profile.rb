ActiveAdmin.register Api::V3::Profile, as: 'Profile' do
  menu parent: 'General Settings'

  permit_params :context_node_type_id, :name

  form do |f|
    f.semantic_errors
    inputs do
      input :context_node_type, as: :select, required: true,
                                collection: Api::V3::ContextNodeType.select_options
      input :name, as: :select,
                   collection: Api::V3::Profile::NAME,
                   hint: object.class.column_comment('name')
    end
    f.actions
  end

  index do
    column('Country') { |property| property.context_node_type&.context&.country&.name }
    column('Commodity') { |property| property.context_node_type&.context&.commodity&.name }
    column('Node Type') { |property| property.context_node_type&.node_type&.name }
    column :name
    actions
  end

  show do
    attributes_table do
      row('Country') { |property| property.context_node_type&.context&.country&.name }
      row('Commodity') { |property| property.context_node_type&.context&.commodity&.name }
      row('Node Type') { |property| property.context_node_type&.node_type&.name }
      row :name
      row :created_at
      row :updated_at
    end
  end

  filter :context_node_type, collection: -> {
    Api::V3::ContextNodeType.
      select_options
  }

  filter :context_node_type, collection: -> {
    Api::V3::ContextNodeType.select_options
  }
end
