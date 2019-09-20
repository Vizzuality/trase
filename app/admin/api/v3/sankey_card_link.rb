ActiveAdmin.register Api::V3::SankeyCardLink, as: 'SankeyCardLinks' do
  menu parent: 'Sankey & Map'

  permit_params :link_param, :title, :subtitle

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts')
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :link_param, input_html: {value: f.object.link}, as: :string, required: true
      input :title, as: :string, required: true
      input :subtitle, as: :string
    end
    f.actions
  end

  index do
    column('Title', sortable: true, &:title)
    column :subtitle
    column('Link', sortable: true) do |sankey_card_link|
      link_to(sankey_card_link.link, sankey_card_link.link)
    end
    actions
  end

  filter :link_contains, as: :string, label: 'Link'

  show do
    attributes_table do
      row :link do |sankey_card_link|
        link_to(sankey_card_link.link, sankey_card_link.link)
      end
      row :title
      row :subtitle
      row :created_at
      row :updated_at
    end
  end
end
