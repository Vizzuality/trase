ActiveAdmin.register Content::Post do
  permit_params :title, :title_color, :date, :image, :post_url, :state, :description, :highlighted

  form do |f|
    f.semantic_errors
    inputs do
      input :title, :required => true
      input :title_color, :required => false
      input :date, :as => :date_select, :required => true, :label => 'Publishing date'
      input :image, :as => :file
      input :post_url, :required => true
      input :state, :as => :boolean, :label => 'Published?'
      input :highlighted, :as => :boolean, :label => 'Highlighted?'
      input :description, :as => :ckeditor, :label => 'Content'
    end
    f.actions
  end

  show do
    attributes_table do
      row :title
      row :title_color
      row :date do |post|
        post.date.strftime('%d-%m-%Y')
      end
      row :image do |post|
        image_tag post.image.url(:small)
      end
      row(:post_url, style: 'word-break: break-all')
      row('Published?') { |post| status_tag post.state == 1 }
      row('Highlighted?') { |post| status_tag post.highlighted == 1 }
      row 'Content' do |post|
        post.description.html_safe
      end
    end
  end

  index :download_links => false do
    column :title
    column('Date') { |post| post.date.strftime('%d-%m-%Y') }
    column('Published?') { |post| status_tag post.state == 1 }
    column('Highlighted?') { |post| status_tag post.highlighted }
    column('URL') { |post| post.complete_post_url }
    actions
  end

  filter :title
  filter :data
  filter :state, :as => :check_boxes, :label => 'Published'
  filter :highlighted, :as => :check_boxes, :label => 'Highlighted?'


end
