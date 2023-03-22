ActiveAdmin.register Api::V3::MapAttributeGroup, as: "MapAttributeGroup" do
  menu parent: "Sankey & Map", priority: 2

  permit_params :context_id, :name, :position

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp("/api/v3/contexts/.+/map_layers")
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :context, as: :select, required: true,
                      collection: Api::V3::Context.select_options
      input :name, required: true, as: :string,
                   hint: object.class.column_comment("name")
      input :position, required: true,
                       hint: object.class.column_comment("position")
    end
    f.actions
  end

  index do
    column("Country") { |group| group.context&.country&.name }
    column("Commodity") { |group| group.context&.commodity&.name }
    column :name
    column :position
    actions
  end

  show do
    attributes_table do
      row("Country") { |group| group.context&.country&.name }
      row("Commodity") { |group| group.context&.commodity&.name }
      row :name
      row :position
      row :created_at
      row :updated_at
    end
  end

  filter :context, collection: -> { Api::V3::Context.select_options }
end
