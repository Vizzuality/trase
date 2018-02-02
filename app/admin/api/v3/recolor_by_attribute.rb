ActiveAdmin.register Api::V3::RecolorByAttribute, as: 'RecolorByAttribute' do
  menu parent: 'Yellow Tables'

  includes [
    {context: [:country, :commodity]},
    :recolor_by_ind,
    :recolor_by_qual
  ]

  permit_params :context_id, :group_number, :position, :legend_type,
                :legend_color_theme, :interval_count, :min_value, :max_value,
                :divisor, :tooltip_text, :years_str, :is_disabled, :is_default,
                :readonly_attribute_id

  form do |f|
    f.semantic_errors
    inputs do
      input :readonly_attribute_id, as: :select,
            collection: Api::V3::Readonly::Attribute.select_options
      input :context, as: :select, required: true,
            collection: Api::V3::Context.select_options
      input :group_number, required: true,
            hint: object.class.column_comment('group_number')
      input :position, required: true,
            hint: object.class.column_comment('position')
      input :legend_type, required: true, as: :select,
            collection: Api::V3::RecolorByAttribute::LEGEND_TYPE,
            hint: object.class.column_comment('legend_type')
      input :legend_color_theme, required: true, as: :select,
            collection: Api::V3::RecolorByAttribute::LEGEND_COLOR_THEME,
            hint: object.class.column_comment('legend_color_theme')
      input :interval_count,
            hint: object.class.column_comment('interval_count')
      input :min_value, as: :string,
            hint: object.class.column_comment('min_value')
      input :max_value, as: :string,
            hint: object.class.column_comment('max_value')
      input :divisor,
            hint: object.class.column_comment('divisor')
      input :tooltip_text, as: :string,
            hint: object.class.column_comment('tooltip_text')
      input :years_str, label: 'Years',
            hint: (object.class.column_comment('years') || '') + ' (comma-separated list)'
      input :is_disabled, as: :boolean, required: true,
            hint: object.class.column_comment('is_disabled')
      input :is_default, as: :boolean, required: true,
            hint: object.class.column_comment('is_default')
    end
    f.actions
  end

  index do
    column :readonly_attribute_name
    column('Country') { |property| property.context&.country&.name }
    column('Commodity') { |property| property.context&.commodity&.name }
    column :group_number
    column :position
    column :legend_type
    column :legend_color_theme
    column :interval_count
    column :min_value
    column :max_value
    column :divisor
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
