ActiveAdmin.register Content::Post, as: "Post" do
  menu parent: "Content"

  permit_params :title, :date, :image, :post_url, :category, :state, :highlighted
  config.sort_order = "date_desc"

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_url(content_posts_url)
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :title, required: true
      input :date,
            as: :date_select,
            required: true,
            label: "Publishing date",
            hint: "Content on the site is sorted by publishing date"
      input :image, as: :file, hint: if f.object.image.present?
                                       image_tag(f.object.image.url(:small))
                                     else
                                       content_tag(:span, "no image available")
                                     end
      input :post_url, required: true
      input :category,
            required: true,
            as: :select,
            collection: Content::Post::CATEGORIES,
            hint: "'INSIGHT', 'INFO BRIEF', 'ISSUE BRIEF' and 'LONGER READ' are displayed under the homepage's 'Insights' section, while 'NEWS' and 'BLOG' will be shown under the section with the same name."
      input :state,
            required: true,
            as: :boolean,
            label: "Published?",
            hint: "To be displayed on the website, a post must be published"
      input :highlighted,
            required: true,
            as: :boolean,
            label: "Highlighted?",
            hint: "A highlighted post will show over the homepage's top section. Highlighting a post will automatically remove highlighted status from all others, as there can be only one highlighted post at a time"
    end
    f.actions
  end

  show do
    attributes_table do
      row :title
      row :date do |post|
        post.date.strftime("%d-%m-%Y")
      end
      row :image do |post|
        image_tag post.image.url(:small)
      end
      row(:post_url, style: "word-break: break-all")
      row(:category)
      row("Published?") { |post| status_tag post.state == 1 }
      row("Highlighted?") { |post| status_tag post.highlighted }
    end
  end

  index download_links: false do
    column :title
    column("Date", sortable: :date) { |post| post.date.strftime("%d-%m-%Y") }
    column :category
    column("Published?") { |post| status_tag post.state == 1 }
    column("Highlighted?") { |post| status_tag post.highlighted }
    column("URL", &:complete_post_url)
    actions
  end

  filter :title
  filter :data
  filter :category, as: :select, collection: Content::Post::CATEGORIES
  filter :state, as: :check_boxes, label: "Published"
  filter :highlighted, as: :check_boxes, label: "Highlighted?"
end
