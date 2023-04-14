ActiveAdmin.register Content::SiteDive, as: "Site Dive" do
  menu parent: "Content"

  permit_params :title, :page_url, :description

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      return unless @site_dive&.id
      clear_cache_for_url(content_site_dive_url(@site_dive))
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :title, required: true
      input :page_url, required: true
      input :description, required: true, as: :ckeditor, label: "Content"
    end
    f.actions
  end

  show do
    attributes_table do
      row :title
      row("Content", style: "word-break: break-all") do |site_dive|
        site_dive.description.html_safe
      end
      row("Site dive link", style: "word-break: break-all", &:site_dive_url)
    end
  end

  index download_links: false do
    column :title
    actions
  end
end
