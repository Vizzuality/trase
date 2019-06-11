ActiveAdmin.register Api::V3::ResizeByAttribute, as: 'ResizeByAttribute' do
  belongs_to :context, parent_class: Api::V3::Context

  include ActiveAdmin::SortableTable # creates the controller action which handles the sorting
  config.sort_order = '' # overriding scoped_collection to sort by 2 columns

  includes [
    {context: [:country, :commodity]},
    :resize_by_quant
  ]

  permit_params :context_id, :group_number, :tooltip_text, :years_str,
                :is_disabled, :is_default, :readonly_attribute_id

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts')
    end

    before_action { @page_title = "#{parent.country.name} #{parent.commodity.name} resize by attributes" }

    def scoped_collection
      super.reorder(group_number: :asc, position: :asc)
    end

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
    column('Group', :group_number) do |ra|
      activator_id = "activator_api_v3_resize_by_attribute_#{ra.id}_group_number"
      div(id: activator_id, class: 'best_in_place_activator', title: 'Click to edit') do
        best_in_place(
          ra,
          :group_number,
          as: :input,
          url: admin_context_resize_by_attribute_path(ra.context, ra),
          activator: "##{activator_id}"
        )
      end
    end
    column :tooltip_text do |ra|
      activator_id = "activator_api_v3_resize_by_attribute_#{ra.id}_tooltip_text"
      div(id: activator_id, class: 'best_in_place_activator', title: 'Click to edit') do
        best_in_place(
          ra,
          :tooltip_text,
          as: :textarea,
          url: admin_context_resize_by_attribute_path(ra.context, ra),
          activator: "##{activator_id}",
          ok_button: 'Save',
          cancel_button: 'Cancel'
        )
      end
    end
    toggle_bool_column :is_disabled
    toggle_bool_column :is_default
    actions
    handle_column(
      move_to_top_url: ->(ra) { move_to_top_admin_context_resize_by_attribute_path(ra.context, ra) },
      sort_url: ->(ra) { sort_admin_context_resize_by_attribute_path(ra.context, ra) }
    )
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
