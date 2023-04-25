ActiveAdmin.register Api::V3::DashboardTemplate, as: "DashboardTemplate" do
  menu parent: "Dashboards"

  permit_params :title, :description, :image, :category, commodity_ids: [],
                                                         company_ids: [], country_ids: [], destination_ids: [],
                                                         source_ids: []

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp("/api/v3/contexts/.+/dashboards/templates/.+")
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :title, as: :string, required: true
      input :description, required: true
      input :category
      input :image, as: :file, hint: if f.object.image.present?
                                       image_tag(f.object.image.url(:small))
                                     else
                                       content_tag(:span, "no image available")
                                     end

      input :commodity_ids,
            as: :selected_list,
            label: "Commodities",
            url: "/admin/commodity_search",
            response_root: "data",
            hint: "Choose a commodity by name."

      input :country_ids,
            as: :selected_list,
            label: "Countries",
            url: "/admin/country_search",
            response_root: "data",
            hint: "Choose a country by name."

      input :source_ids,
            as: :selected_list,
            label: "Sources",
            minimum_input_length: 2,
            url: "/admin/source_search",
            display_name: :stringify,
            response_root: "data",
            hint: "Choose a source by name. The context displayed is merely for guidance, and will not restrict the dashboard to that country/source. Nodes used in multiple contexts will only be displayed once."

      input :company_ids,
            as: :selected_list,
            label: "Companies",
            minimum_input_length: 3,
            url: "/admin/company_search",
            display_name: :stringify,
            response_root: "data",
            hint: "Choose a company by name. The context displayed is merely for guidance, and will not restrict the dashboard to that country/company. Nodes used in multiple contexts will only be displayed once."

      input :destination_ids,
            as: :selected_list,
            label: "Destinations",
            minimum_input_length: 2,
            url: "/admin/destination_search",
            display_name: :stringify,
            response_root: "data",
            hint: "Choose a destination by name. The context displayed is merely for guidance, and will not restrict the dashboard to that country/destination. Nodes used in multiple contexts will only be displayed once."
    end
    f.actions
  end

  index do
    column :title
    column :description
    column :category
    actions
  end

  show do
    attributes_table_for dashboard_template do
      row :title
      row :description
      row :category
      panel "Commodities" do
        table_for dashboard_template.commodities do
          column :name
        end
      end
      panel "Countries" do
        table_for dashboard_template.countries do
          column :name
        end
      end
      panel "Sources" do
        table_for dashboard_template.sources do
          column :name
          column(:node_type) { |source| source.node_type&.name }
          column(:country) { |source| source.node_type&.context_node_types&.first&.context&.country&.name }
          column(:commodity) { |source| source.node_type&.context_node_types&.first&.context&.commodity&.name }
        end
      end
      panel "Companies" do
        table_for dashboard_template.companies do
          column :name
          column(:node_type) { |company| company.node_type&.name }
          column(:country) { |company| company.node_type&.context_node_types&.first&.context&.country&.name }
          column(:commodity) { |company| company.node_type&.context_node_types&.first&.context&.commodity&.name }
        end
      end
      panel "Destinations" do
        table_for dashboard_template.destinations do
          column :name
          column(:node_type) { |destination| destination.node_type&.name }
          column(:country) { |destination| destination.node_type&.context_node_types&.first&.context&.country&.name }
          column(:commodity) { |destination| destination.node_type&.context_node_types&.first&.context&.commodity&.name }
        end
      end
    end
  end

  filter :commodities, as: :select, collection: -> { Api::V3::Commodity.select_options }
  filter :countries, as: :select, collection: -> { Api::V3::Country.select_options }
end
