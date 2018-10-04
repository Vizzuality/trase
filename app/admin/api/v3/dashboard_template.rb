ActiveAdmin.register Api::V3::DashboardTemplate, as: 'DashboardTemplate' do
  menu parent: 'Dashboards'

  permit_params :title, :description, :image, node_ids: []

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp('/api/v3/contexts/.+/dashboards/templates/.+')
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :title, as: :string, required: true
      input :description, required: true
      input :image, as: :file, hint: if f.object.image.present?
                                       image_tag(f.object.image.url(:small))
                                     else
                                       content_tag(:span, 'no image available')
                                     end
      input :node_ids, as: :selected_list,
                       label: 'Nodes',
                       minimum_input_length: 2,
                       url: '/admin/node_search',
                       display_name: :stringify,
                       response_root: 'data',
                       hint: 'Choose a node by name. The context displayed is merely for guidance, and will not restrict the dashboard to that country/commodity. Nodes used in multiple contexts will only be displayed once.'
    end
    f.actions
  end

  index do
    column :title
    column :description
    actions
  end

  show do
    attributes_table_for dashboard_template do
      row :title
      row :description
      panel 'Nodes' do
        table_for dashboard_template.nodes do
          column :name
          column(:node_type) { |node| node.node_type&.name }
          column(:country) { |node| node.node_type&.context_node_types&.first&.context&.country&.name }
          column(:commodity) { |node| node.node_type&.context_node_types&.first&.context&.commodity&.name }
          # column :node_type.name
        end
      end
    end
  end
end
