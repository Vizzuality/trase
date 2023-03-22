ActiveAdmin.register Api::V3::QuantContextProperty, as: "QuantContextProperty" do
  menu parent: "Tooltips", priority: 9

  permit_params :quant_id, :context_id, :tooltip_text, :display_name

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp("/api/v3/contexts")
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :quant, as: :select, required: true,
                    collection: Api::V3::Quant.select_options
      input :context, as: :select, required: true,
                      collection: Api::V3::Context.select_options
      input :display_name, as: :string, required: true,
                           hint: object.class.column_comment("display_name")
      input :tooltip_text, as: :string, required: true,
                           hint: object.class.column_comment("tooltip_text")
    end
    f.actions
  end

  index do
    div Api::V3::QuantContextProperty.column_comment("tooltip_text")
    div do
      link_to "Link to country-specific tooltip", admin_quant_country_properties_path
    end
    br br
    column("Quant name") { |property| property.quant&.name }
    column("Country") { |property| property.context&.country&.name }
    column("Commodity") { |property| property.context&.commodity&.name }
    column :display_name
    column :tooltip_text
    actions
  end

  show do
    attributes_table do
      row :display_name
      row :tooltip_text
      row("Country") { |property| property.context&.country&.name }
      row("Commodity") { |property| property.context&.commodity&.name }
      row("Quant") { |property| property.quant&.name }
      row :created_at
      row :updated_at
    end
  end

  filter :quant, collection: -> { Api::V3::Quant.select_options }
  filter :context, collection: -> { Api::V3::Context.select_options }
end
