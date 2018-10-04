ActiveAdmin.register Api::V3::DashboardTemplate, as: 'DashboardTemplate' do
  menu parent: 'Dashboards'

  permit_params :title, :description, :image

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts/.+/dashboards/templates/.+')
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :title, as: :string, required: true
      input :description, required: true
      input :image, as: :file, hint: if f.object.image.present?
                                       image_tag(f.object.image.url(:small))
                                     else
                                       content_tag(:span, 'no image available')
                                     end
    end
    f.actions
  end

  index do
    column :title
    column :description
    actions
  end

  show do
    attributes_table do
      row :title
      row :description
    end
  end
end
