ActiveAdmin.register Content::StaffMember, as: 'Staff Member' do
  menu parent: 'Content'

  permit_params :name, :image, :position, :bio

  form do |f|
    f.semantic_errors
    inputs do
      input :name, required: true, as: :string
      input :image, as: :file
      input :position
      input :bio
    end
    f.actions
  end

  show do
    attributes_table do
      row :name
      row :image do |member|
        image_tag member.image.url(:small)
      end
      row :position
      row(:bio)
    end
  end

  index download_links: false do
    column :name
    column :image do |member|
      image_tag member.image.url(:small)
    end
    column :position
    column :bio
    actions
  end

  filter :name
end
