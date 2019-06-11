ActiveAdmin.register Api::V3::RecolorByAttribute, as: 'RecolorByAttribute' do
  belongs_to :context, parent_class: Api::V3::Context

  includes [
    {context: [:country, :commodity]},
    :recolor_by_ind,
    :recolor_by_qual
  ]

  permit_params :context_id, :group_number, :position, :legend_type,
                :legend_color_theme, :interval_count, :min_value, :max_value,
                :divisor, :tooltip_text, :years_str, :is_disabled, :is_default,
                :readonly_attribute_id

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts')
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :readonly_attribute_id, as: :select,
                                    collection: Api::V3::Readonly::Attribute.select_options,
                                    label: 'Recolor By Property'
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
    column('Recolor By Property', sortable: true, &:readonly_attribute_display_name)
    column :position
    column :tooltip_text
    column :years
    column :is_disabled
    column :is_default
    actions
  end

  show do
    attributes_table do
      row :readonly_attribute_display_name
      row('Country') { |property| property.context&.country&.name }
      row('Commodity') { |property| property.context&.commodity&.name }
      row('Recolor By Property', &:readonly_attribute_display_name)

      row :group_number
      row :position
      row :legend_type
      row :legend_color_theme
      row :interval_count
      row :min_value
      row :max_value
      row :divisor
      row :tooltip_text
      row('Years', &:years_str)
      row :is_disabled
      row :is_default
      row :created_at
      row :updated_at
    end
  end

  filter :is_disabled
  filter :is_default
end
