ActiveAdmin.register Api::V3::MapAttribute, as: 'MapAttribute' do
  menu parent: 'Yellow Tables'

  includes [
    {map_attribute_group: {context: [:country, :commodity]}},
    :map_ind,
    :map_quant
  ]

  permit_params :map_attribute_group_id, :position, :bucket_3_str,
                :bucket_5_str, :color_scale, :years_str, :is_disabled,
                :is_default, :readonly_attribute_id

  form do |f|
    f.semantic_errors
    inputs do
      input :readonly_attribute_id, as: :select, collection: Api::V3::Readonly::Attribute.
        select_options
      input :map_attribute_group, as: :select, required: true,
        collection: Api::V3::MapAttributeGroup.select_options
      input :position, required: true
      input :bucket_3_str, hint: 'Comma-separated list of 2 values', label: 'Bucket 3', required: true
      input :bucket_5_str, hint: 'Comma-separated list of 4 values', label: 'Bucket 5', required: true
      input :color_scale, as: :string
      input :years_str, hint: 'Comma-separated list of years', label: 'Years'
      input :is_disabled, as: :boolean, required: true
      input :is_default, as: :boolean, required: true
    end
    f.actions
  end

  index do
    column :readonly_attribute_name
    column('Country') { |attribute| attribute.map_attribute_group&.context&.country&.name }
    column('Commodity') { |attribute| attribute.map_attribute_group&.context&.commodity&.name }
    column('MapAttributeGroup') { |attribute| attribute.map_attribute_group&.name }
    column :position
    column :bucket_3
    column :bucket_5
    column :color_scale
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

  filter :map_attribute_group, collection: -> { Api::V3::MapAttributeGroup.
    select_options }
end
