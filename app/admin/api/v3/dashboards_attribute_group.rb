ActiveAdmin.register Api::V3::DashboardsAttributeGroup, as: "DashboardsAttributeGroup" do
  menu parent: "Dashboards"

  after_action :clear_cache, only: [:create, :update, :destroy]

  permit_params :name,
                :position

  controller do
    def clear_cache
      clear_cache_for_regexp("/api/v3/dashboards/indicators")
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :name, required: true, as: :string,
                   hint: object.class.column_comment("name")
      input :position, required: true,
                       hint: object.class.column_comment("position")
    end
    f.actions
  end

  index do
    column :name
    column :position
    actions
  end

  show do
    attributes_table do
      row :name
      row :position
      row :created_at
      row :updated_at
    end
  end
end
