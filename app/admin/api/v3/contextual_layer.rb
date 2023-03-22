ActiveAdmin.register Api::V3::ContextualLayer, as: "ContextualLayer" do
  menu parent: "Sankey & Map", priority: 4

  permit_params :context_id, :title, :identifier, :position,
                :tooltip_text, :legend, :is_default

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
      input :title, required: true, as: :string,
                    hint: object.class.column_comment("title")
      input :identifier, required: true, as: :string,
                         hint: object.class.column_comment("identifier")
      input :position, required: true,
                       hint: object.class.column_comment("position")
      input :tooltip_text, as: :string,
                           hint: object.class.column_comment("tooltip_text")
      input :legend,
            hint: object.class.column_comment("legend")
      input :is_default, as: :boolean, required: true,
                         hint: object.class.column_comment("is_default")
    end
    f.actions
  end

  index do
    column("Country") { |property| property.context&.country&.name }
    column("Commodity") { |property| property.context&.commodity&.name }
    column :title
    column :identifier
    column :position
    column :tooltip_text
    column :legend
    column :is_default
    actions
  end

  show do
    attributes_table do
      row("Country") { |attr| attr.context&.country&.name }
      row("Commodity") { |attr| attr.context&.commodity&.name }
      row :title
      row :identifier
      row :position
      row :tooltip_text
      row :legend
      row :is_default
      row :created_at
      row :updated_at
    end
  end

  filter :context, collection: -> { Api::V3::Context.select_options }
end
