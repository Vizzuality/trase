ActiveAdmin.register Api::V3::DownloadVersion, as: "DownloadVersion" do
  menu parent: "Data Download"

  permit_params :context_id, :is_current, :symbol, :created_at

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp("/api/v3/contexts/.+/download_attributes")
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :context, as: :select, required: true,
                      collection: Api::V3::Context.select_options
      input :is_current,
            hint: object.class.column_comment("is_current")
      input :symbol, required: true, as: :string,
                     hint: object.class.column_comment("symbol")
    end
    f.actions
  end

  index do
    column("Country") { |property| property.context&.country&.name }
    column("Commodity") { |property| property.context&.commodity&.name }
    column :is_current
    column :symbol
    column :created_at
    actions
  end

  show do
    attributes_table do
      row("Country") { |property| property.context&.country&.name }
      row("Commodity") { |property| property.context&.commodity&.name }

      row :is_current
      row :symbol
      row :created_at
    end
  end

  filter :context, collection: -> { Api::V3::Context.select_options }
end
