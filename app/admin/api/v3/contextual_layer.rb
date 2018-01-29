ActiveAdmin.register Api::V3::ContextualLayer, as: 'ContextualLayer' do
  menu parent: 'Yellow Tables'

  permit_params :context_id, :title, :identifier, :position,
                :tooltip_text, :legend, :is_default

  form do |f|
    f.semantic_errors
    inputs do
      input :context, as: :select, required: true,
        collection: Api::V3::Context.select_options
      input :title, required: true, as: :string
      input :identifier, required: true, as: :string
      input :position, required: true
      input :tooltip_text, as: :string
      input :legend
      input :is_default, as: :boolean, required: true
    end
    f.actions
  end

  index do
    column('Country') { |property| property.context&.country&.name }
    column('Commodity') { |property| property.context&.commodity&.name }
    column :title
    column :identifier
    column :position
    column :tooltip_text
    column :legend
    column :is_default
    actions
  end

  filter :context, collection: -> { Api::V3::Context.select_options }
end