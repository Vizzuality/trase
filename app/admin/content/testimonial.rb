ActiveAdmin.register Content::Testimonial, as: "Testimonial" do
  menu parent: "Content"

  permit_params :quote, :author_name, :author_title, :image

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_url(content_testimonials_url)
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :quote, required: true
      input :author_name, required: true
      input :author_title, required: true
      input :image, as: :file
    end
    f.actions
  end

  show do
    attributes_table do
      row :quote
      row :author_name
      row :author_title
      row :image do |post|
        image_tag post.image.url(:small)
      end
    end
  end

  index download_links: false do
    column :quote
    column :author_name
    column :author_title
    actions
  end

  filter :quote
  filter :author_name
  filter :author_title
end
