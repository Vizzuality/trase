ActiveAdmin.register Api::V3::TopProfileImage, as: "Top Profile Image" do
  menu parent: "Profiles", priority: 3
  permit_params :commodity_id, :profile_type, :image

  controller do
    def create
      super do |success, _failure|
        success.html { redirect_to admin_top_profile_images_path }
      end
    end
  end

  index do
    column("Commodity") { |top_profile_image| top_profile_image&.commodity&.name }
    column("Profile type") { |top_profile_image| top_profile_image&.profile_type }
    column("Image") { |top_profile_image| image_tag top_profile_image.image_url(:small) }
    actions
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :profile_type,
            as: :select,
            required: true,
            collection: Api::V3::Profile::NAMES
      input :commodity, as: :select, required: true,
                        collection: Api::V3::Commodity.select_options
      input :image, as: :file, required: true
    end
    f.actions
  end

  show do
    attributes_table do
      row :image do |top_profile_image|
        image_tag top_profile_image.image_url(:small)
      end
      row("Commodity") { |top_profile_image| top_profile_image&.commodity&.name }
      row :profile_type
    end
  end

  filter :profile_type, as: :select, collection: -> {
    Api::V3::Profile::NAMES
  }
  filter :commodity, collection: -> { Api::V3::Commodity.select_options }
end
