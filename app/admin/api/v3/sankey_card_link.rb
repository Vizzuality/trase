ActiveAdmin.register Api::V3::SankeyCardLink, as: 'SankeyCardLinks' do
  menu parent: 'Sankey & Map'

  permit_params :link_param, :title, :subtitle, :level1, :level2, :level3

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
      input :title, as: :string, required: true,
                    hint: object.class.column_comment('title')
      input :subtitle, as: :string, hint: object.class.column_comment('subtitle')
      input :level1, as: :boolean, hint: object.class.column_comment('level1')
      input :level2, as: :boolean, hint: object.class.column_comment('level2')
      input :level3, as: :boolean, hint: object.class.column_comment('level3')
    end
    f.actions
  end

  index do
    column('Commodity', sortable: true) do |sankey_card_link|
      sankey_card_link.commodity.name
    end
    column('Country', sortable: true) do |sankey_card_link|
      sankey_card_link.country.name
    end
    column('Link', sortable: true) do |sankey_card_link|
      link_to(sankey_card_link.link&.truncate(27), sankey_card_link.link)
    end
    column('Title', sortable: true, &:title)
    column :subtitle
    column :level do |sankey_card_link|
      Api::V3::SankeyCardLink::LEVELS.select { |n| sankey_card_link.send("level#{n}") }.join(', ')
    end
    actions
  end

  show do
    attributes_table do
      row('Commodity', sortable: true) do |sankey_card_link|
        sankey_card_link.commodity.name
      end
      row('Country', sortable: true) do |sankey_card_link|
        sankey_card_link.country.name
      end
      row :link do |sankey_card_link|
        link_to(sankey_card_link.link&.truncate(27), sankey_card_link.link)
      end
      row :query_params
      row :title
      row :subtitle
      row :level do |sankey_card_link|
        Api::V3::SankeyCardLink::LEVELS.select { |n| sankey_card_link.send("level#{n}") }.join(', ')
      end
      row :created_at
      row :updated_at
    end
  end
end
