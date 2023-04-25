ActiveAdmin.register Content::StaffMember, as: "Staff Member" do
  menu parent: "Content"

  includes :staff_group

  permit_params :staff_group_id, :name, :image, :position, :bio

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_url(content_staff_groups_url)
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :staff_group,
            required: true,
            as: :select,
            collection: Content::StaffGroup.select_options
      input :name, required: true, as: :string
      input :position, required: true, hint: "Display order within staff group"
      input :bio,
            required: true,
            as: :simplemde_editor,
            hint: "Staff member bio formatted in markdown"
      input :image, as: :file, hint: if f.object.image.present?
                                       image_tag(f.object.image.url(:small))
                                     else
                                       content_tag(:span, "no image available")
                                     end
    end
    f.actions
  end

  show do
    attributes_table do
      row("Staff Group") { |member| member.staff_group&.name }
      row :name
      row :position
      row :bio
      row :image do |member|
        image_tag member.image.url(:small)
      end
    end
  end

  index download_links: false do
    column("Staff Group") { |member| member.staff_group&.name }
    column :name
    column :position
    column :bio
    actions
  end

  filter :name
end
