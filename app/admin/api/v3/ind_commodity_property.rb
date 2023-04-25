ActiveAdmin.register Api::V3::IndCommodityProperty, as: "IndCommodityProperty" do
  menu parent: "Tooltips", priority: 3

  permit_params :ind_id, :commodity_id, :tooltip_text, :display_name

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp("/api/v3/contexts")
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :ind, as: :select, required: true,
                  collection: Api::V3::Ind.select_options
      input :commodity, as: :select, required: true,
                        collection: Api::V3::Commodity.select_options
      input :display_name, as: :string, required: true,
                           hint: object.class.column_comment("display_name")
      input :tooltip_text, as: :string, required: true,
                           hint: object.class.column_comment("tooltip_text")
    end
    f.actions
  end

  index do
    div Api::V3::IndCommodityProperty.column_comment("tooltip_text")
    div do
      link_to "Link to country-specific tooltip", admin_ind_country_properties_path
    end
    div do
      link_to "Link to generic tooltip", admin_ind_properties_path
    end
    br br
    column("Ind name") { |property| property.ind&.name }
    column("Commodity") { |property| property.commodity&.name }
    column :display_name
    column :tooltip_text
    actions
  end

  show do
    attributes_table do
      row :display_name
      row :tooltip_text
      row("Commodity") { |property| property.commodity&.name }
      row("Ind") { |property| property.ind&.name }
      row :created_at
      row :updated_at
    end
  end

  filter :ind, collection: -> { Api::V3::Ind.select_options }
  filter :commodity, collection: -> { Api::V3::Commodity.select_options }
end
