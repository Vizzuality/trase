ActiveAdmin.register Api::V3::ResizeByAttribute, as: 'ResizeByAttribute' do
  menu parent: 'Yellow Tables'

  includes [
    {context: [:country, :commodity]},
    :resize_by_quant
  ]

  permit_params :context_id, :group_number, :position, :tooltip_text,
                :years_str, :is_disabled, :is_default, :readonly_attribute_id

  form do |f|
    f.semantic_errors
    inputs do
      input :readonly_attribute_id, as: :select, collection: Api::V3::Readonly::Attribute.
        select_options
      input :context, as: :select, required: true,
        collection: Api::V3::Context.select_options
      input :group_number, required: true
      input :position, required: true
      input :tooltip_text, as: :string
      input :years_str, hint: 'Comma-separated list of years', label: 'Years'
      input :is_disabled, as: :boolean, required: true
      input :is_default, as: :boolean, required: true
    end
    f.actions
  end

  index do
    column :readonly_attribute_name
    column('Country') { |property| property.context&.country&.name }
    column('Commodity') { |property| property.context&.commodity&.name }
    column :group_number
    column :position
    column :tooltip_text
    column :years
    column :is_disabled
    column :is_default
    actions
  end

  show do
    attributes_table do
      row :readonly_attribute_name
      default_attribute_table_rows.each do |field|
        row field
      end
    end
  end

  filter :context, collection: -> { Api::V3::Context.select_options }
end
