ActiveAdmin.register Api::V3::MapAttribute, as: "MapAttribute" do
  menu parent: "Sankey & Map", priority: 3

  includes [
    {map_attribute_group: {context: [:country, :commodity]}},
    :map_ind,
    :map_quant
  ]

  permit_params :map_attribute_group_id, :position, :dual_layer_buckets_str,
                :single_layer_buckets_str, :color_scale, :years_str, :is_disabled,
                :is_default, :readonly_attribute_id

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp("/api/v3/contexts/.+/map_layers")
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :readonly_attribute_id, as: :select,
                                    collection: Api::V3::Readonly::Attribute.select_options
      input :map_attribute_group, as: :select, required: true,
                                  collection: Api::V3::MapAttributeGroup.select_options
      input :position, required: true,
                       hint: object.class.column_comment("position")
      input :single_layer_buckets_str,
            required: true,
            hint: (object.class.column_comment("single_layer_buckets") || "") +
              " (comma-separated list)",
            label: "Single dimension buckets (variable length)"
      input :dual_layer_buckets_str,
            required: true,
            hint: (object.class.column_comment("dual_layer_buckets") || "") +
              " (comma-separated list)",
            label: "Dual dimension buckets (3 values)"
      input :color_scale, as: :select, collection: Api::V3::MapAttribute::COLOR_SCALE,
                          hint: object.class.column_comment("color_scale")
      input :years_str, label: "Years",
                        hint: (object.class.column_comment("years") || "") + " (comma-separated list)"
      input :is_disabled, as: :boolean, required: true,
                          hint: object.class.column_comment("is_disabled")
      input :is_default, as: :boolean, required: true,
                         hint: object.class.column_comment("is_default")
    end
    f.actions
  end

  index do
    column :readonly_attribute_display_name
    column("Country") { |attribute| attribute.map_attribute_group&.context&.country&.name }
    column("Commodity") { |attribute| attribute.map_attribute_group&.context&.commodity&.name }
    column("Map Attribute Group") { |attribute| attribute.map_attribute_group&.name }
    column :position
    column :years
    column :is_disabled
    column :is_default
    actions
  end

  show do
    attributes_table do
      row :readonly_attribute_display_name
      row :map_attribute_group
      row("Country") { |attr| attr.map_attribute_group&.context&.country&.name }
      row("Commodity") { |attr| attr.map_attribute_group&.context&.commodity&.name }
      row :position
      row("Single dimension buckets", &:single_layer_buckets_str)
      row("Dual dimension buckets", &:dual_layer_buckets_str)
      row :color_scale
      row("Years", &:years_str)
      row :is_disabled
      row :is_default
      row :created_at
      row :updated_at
    end
  end

  filter :map_attribute_group_context_id, label: "Context", as: :select, collection: -> {
    Api::V3::Context.
      select_options
  }

  filter :map_attribute_group, collection: -> {
    Api::V3::MapAttributeGroup.
      select_options
  }
end
