ActiveAdmin.register Api::V3::CartoLayer, as: "CartoLayer" do
  menu parent: "Sankey & Map"

  permit_params :contextual_layer_id, :identifier, :years_str, :raster_url

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp("/api/v3/contexts/.+/map_layers")
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :contextual_layer, as: :select, required: true,
                               collection: Api::V3::ContextualLayer.select_options
      input :identifier, required: true, as: :string,
                         hint: object.class.column_comment("identifier")
      input :years_str, label: "Years",
                        hint: (object.class.column_comment("years") || "") + " (comma-separated list)"
      input :raster_url,
            hint: object.class.column_comment("raster_url")
    end
    f.actions
  end

  index do
    column("Country") { |layer| layer.contextual_layer&.context&.country&.name }
    column("Commodity") { |layer| layer.contextual_layer&.context&.commodity&.name }
    column("Contextual Layer") { |layer| layer.contextual_layer&.title }
    column :identifier
    column :years
    column :raster_url
    actions
  end

  show do
    attributes_table do
      row :contextual_layer
      row("Country") { |layer| layer.contextual_layer&.context&.country&.name }
      row("Commodity") { |layer| layer.contextual_layer&.context&.commodity&.name }

      row :identifier
      row "Years", &:years_str
      row :raster_url
      row :created_at
      row :updated_at
    end
  end

  filter :contextual_layer, collection: -> { Api::V3::ContextualLayer.select_options }

  filter :contextual_layer_context_id, label: "Context", as: :select, collection: -> { Api::V3::Context.select_options }
end
