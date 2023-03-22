ActiveAdmin.register Content::StaffGroup, as: "Staff Group" do
  menu parent: "Content"

  permit_params :name, :position

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_url(content_staff_groups_url)
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :name, required: true, as: :string
      input :position, required: true, hint: "Display order"
    end
    f.actions
  end

  show do
    attributes_table do
      row :name
      row :position
    end
  end

  index download_links: false do
    column :name
    column :position
    actions
  end

  filter :name
end
