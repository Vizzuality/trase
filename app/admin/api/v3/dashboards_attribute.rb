ActiveAdmin.register Api::V3::DashboardsAttribute, as: "DashboardsAttribute" do
  menu parent: "Dashboards"

  includes [
    :dashboards_attribute_group,
    :dashboards_ind,
    :dashboards_qual,
    :dashboards_quant
  ]

  permit_params :dashboards_attribute_group_id, :position,
                :readonly_attribute_id

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp("/api/v3/dashboards/indicators")
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :readonly_attribute_id,
            as: :select,
            collection: Api::V3::Readonly::Attribute.select_options
      input :dashboards_attribute_group,
            as: :select,
            required: true,
            collection: Api::V3::DashboardsAttributeGroup.select_options
      input :position,
            required: true,
            hint: object.class.column_comment("position")
    end
    f.actions
  end

  index do
    column :readonly_attribute_display_name
    column("Dashboards Attribute Group") { |attribute| attribute.dashboards_attribute_group&.name }
    column :position
    actions
  end

  show do
    attributes_table do
      row :readonly_attribute_display_name
      row :dashboards_attribute_group
      row :position
      row :created_at
      row :updated_at
    end
  end

  filter :dashboards_attribute_group, collection: -> {
    Api::V3::DashboardsAttributeGroup.
      select_options
  }
end
