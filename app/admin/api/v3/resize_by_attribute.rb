ActiveAdmin.register Api::V3::ResizeByAttribute, as: 'ResizeByAttribute' do
  belongs_to :context, parent_class: Api::V3::Context

  includes [
    {context: [:country, :commodity]},
    :resize_by_quant
  ]

  permit_params :context_id, :group_number, :position, :tooltip_text,
                :years_str, :is_disabled, :is_default, :readonly_attribute_id

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts')
    end

    before_action { @page_title = "#{parent.country.name} #{parent.commodity.name} resize by attributes" }

    def create
      super do |success, _failure|
        success.html { redirect_to admin_context_resize_by_attributes_path(parent) }
      end
    end

    def update
      super do |success, _failure|
        success.html { redirect_to admin_context_resize_by_attributes_path(parent) }
      end
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :readonly_attribute_id, as: :select, collection: Api::V3::Readonly::Attribute.
        select_options,
                                    label: 'Resize By Property'
      input :group_number, required: true,
                           hint: object.class.column_comment('group_number')
      input :position, required: true,
                       hint: object.class.column_comment('position')
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
    column('Resize By Property', sortable: true, &:readonly_attribute_display_name)
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
      row('Resize By Property', &:readonly_attribute_display_name)

      row :group_number
      row :position
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
