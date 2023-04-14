ActiveAdmin.register Api::V3::ResizeByAttribute, as: "ResizeByAttribute" do
  belongs_to :context, parent_class: Api::V3::Context

  include ActiveAdmin::SortableTable # creates the controller action which handles the sorting
  config.sort_order = "" # overriding scoped_collection to sort by 2 columns

  includes [
    {context: [:country, :commodity]},
    :resize_by_quant
  ]

  permit_params :context_id, :group_number, :tooltip_text,
                :is_disabled, :is_default,
                :is_downloadable, :download_name,
                :readonly_attribute_id,
                :is_quick_fact

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp("/api/v3/contexts")
    end

    before_action { @page_title = "#{parent.country.name} #{parent.commodity.name} resize by attributes" }

    def scoped_collection
      super.reorder(group_number: :asc, position: :asc)
    end

    def create
      isolate_download_attribute_params
      super do |success, _failure|
        success.html do
          manage_download_attribute
          redirect_to admin_context_resize_by_attributes_path(parent)
        end
      end
    end

    # this action serves both the in place json update and the html update
    def update
      isolate_download_attribute_params
      super do |success, _failure|
        success.json { manage_download_attribute }
        success.html do
          manage_download_attribute
          redirect_to admin_context_resize_by_attributes_path(parent)
        end
      end
    end

    def isolate_download_attribute_params
      ra_params = params["api_v3_resize_by_attribute"]
      @is_downloadable = ra_params.delete("is_downloadable")
      @download_name = ra_params.delete("download_name")
    end

    def manage_download_attribute
      return if @is_downloadable.nil?

      Api::V3::ManageDownloadAttribute.new(
        @context, resource.original_attribute
      ).call(@is_downloadable, @download_name)
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :readonly_attribute_id, as: :select, collection: Api::V3::Readonly::Attribute.
        select_options,
                                    label: "Resize By Property"
      input :group_number, required: true,
                           hint: object.class.column_comment("group_number")
      input :tooltip_text, as: :string,
                           hint: object.class.column_comment("tooltip_text")
      input :is_disabled,
            as: :boolean,
            hint: object.class.column_comment("is_disabled")
      input :is_default,
            as: :boolean,
            hint: object.class.column_comment("is_default")
      input :is_downloadable,
            as: :boolean
      input :download_name
    end
    f.actions
  end

  index do
    column("Resize By Property", sortable: true, &:readonly_attribute_display_name)
    column("Group", :group_number) do |ra|
      activator_id = "activator_api_v3_resize_by_attribute_#{ra.id}_group_number"
      div(id: activator_id, class: "best_in_place_activator", title: "Click to edit") do
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
      div(id: activator_id, class: "best_in_place_activator", title: "Click to edit") do
        best_in_place(
          ra,
          :tooltip_text,
          as: :textarea,
          url: admin_context_resize_by_attribute_path(ra.context, ra),
          activator: "##{activator_id}",
          ok_button: "Save",
          cancel_button: "Cancel"
        )
      end
    end
    toggle_bool_column :is_disabled
    toggle_bool_column :is_default
    toggle_bool_column :is_downloadable
    toggle_bool_column :is_quick_fact

    actions
    handle_column(
      move_to_top_url: ->(ra) { move_to_top_admin_context_resize_by_attribute_path(ra.context, ra) },
      sort_url: ->(ra) { sort_admin_context_resize_by_attribute_path(ra.context, ra) }
    )
  end

  show do
    attributes_table do
      row :readonly_attribute_display_name
      row("Country") { |property| property.context&.country&.name }
      row("Commodity") { |property| property.context&.commodity&.name }
      row("Resize By Property", &:readonly_attribute_display_name)

      row :group_number
      row :position
      row :tooltip_text
      row("Years", &:years_str)
      row :is_disabled
      row :is_default
      row :is_downloadable
      row :download_name
      row :created_at
      row :updated_at
    end
  end

  filter :is_disabled
  filter :is_default
end
