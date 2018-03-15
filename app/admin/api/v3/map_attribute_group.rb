ActiveAdmin.register Api::V3::MapAttributeGroup, as: 'MapAttributeGroup' do
  menu parent: 'Map Settings', priority: 1

  permit_params :context_id, :name, :position

  form do |f|
    f.semantic_errors
    inputs do
      input :context, as: :select, required: true,
                      collection: Api::V3::Context.select_options
      input :name, required: true, as: :string,
                   hint: object.class.column_comment('name')
      input :position, required: true,
                       hint: object.class.column_comment('position')
    end
    f.actions
  end

  index do
    column('Country') { |group| group.context&.country&.name }
    column('Commodity') { |group| group.context&.commodity&.name }
    column :name
    column :position
    actions
  end

  show do
    attributes_table do
      row('Country') { |group| group.context&.country&.name }
      row('Commodity') { |group| group.context&.commodity&.name }
      row :name
      row :position
      row :created_at
      row :updated_at
    end
  end

  filter :context, collection: -> { Api::V3::Context.select_options }
end
