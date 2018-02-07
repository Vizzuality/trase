ActiveAdmin.register Content::StaffGroup, as: 'Staff Group' do
  menu parent: 'Content'

  permit_params :name, :position

  form do |f|
    f.semantic_errors
    inputs do
      input :name, required: true, as: :string
      input :position, required: true, hint: 'Display order'
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
