ActiveAdmin.register Content::StaffMember, as: 'Staff Member' do
  menu parent: 'Content'

  permit_params :name, :image, :position, :bio

  form do |f|
    f.semantic_errors
    inputs do
      input :name, required: true, as: :string
      input :position, required: true, hint: 'Display order within staff group'
      input :bio, required: true, as: :simplemde_editor,
            hint: 'Staff member bio formatted in markdown'
      input :image, as: :file
    end
    f.actions
  end

  show do
    attributes_table do
      row :name
      row :position
      row :bio
      row :image do |member|
        image_tag member.image.url(:small)
      end
    end
  end

  index download_links: false do
    column :name
    column :position
    column :bio
    actions
  end

  filter :name
end
