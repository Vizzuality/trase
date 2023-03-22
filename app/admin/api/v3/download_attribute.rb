ActiveAdmin.register Api::V3::DownloadAttribute, as: "DownloadAttribute" do
  menu parent: "Data Download"

  permit_params :context_id, :position, :display_name, :years_str,
                :readonly_attribute_id

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp("/api/v3/contexts/.+/download_attributes")
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :readonly_attribute_id, as: :select, collection: Api::V3::Readonly::Attribute.
        select_options, label: "Property"
      input :context, as: :select, required: true,
                      collection: Api::V3::Context.select_options
      input :position, required: true,
                       hint: object.class.column_comment("position")
      input :display_name, required: true, as: :string,
                           hint: object.class.column_comment("display_name")
    end
    f.actions
  end

  index do
    column("Property", sortable: true, &:readonly_attribute_display_name)
    column("Country", sortable: true) { |property| property.context&.country&.name }
    column("Commodity", sortable: true) { |property| property.context&.commodity&.name }
    column :position
    column :display_name
    column :years
    actions
  end

  show do
    attributes_table do
      row :readonly_attribute_display_name
      row("Property", &:readonly_attribute_display_name)
      row("Country") { |property| property.context&.country&.name }
      row("Commodity") { |property| property.context&.commodity&.name }

      row :position
      row :display_name
      row :years
      row :created_at
      row :updated_at
    end
  end

  filter :context, collection: -> { Api::V3::Context.select_options }
end
