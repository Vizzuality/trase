ActiveAdmin.register Api::V3::ChartAttribute, as: "ChartAttribute" do
  menu parent: "Profiles", priority: 5

  includes [
    :chart,
    :chart_ind,
    :chart_qual,
    :chart_quant
  ]

  permit_params :chart_id, :display_name, :legend_name, :display_type,
                :display_style, :state_average, :identifier, :position,
                :years_str, :readonly_attribute_id

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp("/api/v3/contexts/.+/places")
      clear_cache_for_regexp("/api/v3/contexts/.+/actors")
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :readonly_attribute_id,
            as: :select,
            collection: Api::V3::Readonly::Attribute.select_options
      input :chart,
            as: :select,
            required: true,
            collection: Api::V3::Chart.select_options
      input :identifier,
            as: :string,
            hint: object.class.column_comment("identifier")
      input :position, hint: object.class.column_comment("position")
      input :display_name, as: :string,
                           hint: object.class.column_comment("display_name")
      input :legend_name, as: :string,
                          hint: object.class.column_comment("legend_name")
      input :display_type, as: :string,
                           hint: object.class.column_comment("display_type")
      input :display_style, as: :string,
                            hint: object.class.column_comment("display_style")
      input :state_average, as: :string,
                            hint: object.class.column_comment("state_average")
      input :years_str, label: "Years",
                        hint: (object.class.column_comment("years") || "") + " (comma-separated list)"
    end
    f.actions
  end

  index do
    column :readonly_attribute_display_name, label: "Attribute"
    column("Country", sortable: true) do |attribute|
      attribute.chart&.profile&.context_node_type&.context&.country&.name
    end
    column("Commodity", sortable: true) do |attribute|
      attribute.chart&.profile&.context_node_type&.context&.commodity&.name
    end
    column("Node Type", sortable: true) do |attribute|
      attribute.chart&.profile&.context_node_type&.node_type&.name
    end
    column("Profile Type", sortable: true) { |attribute| attribute.chart&.profile&.name }
    column :chart
    column :identifier
    column :position
    column :display_name
    column :years
    actions
  end

  show do
    attributes_table do
      row :readonly_attribute_display_name
      row("Country") do |attribute|
        attribute.chart&.profile&.context_node_type&.context&.country&.name
      end
      row("Commodity") do |attribute|
        attribute.chart&.profile&.context_node_type&.context&.commodity&.name
      end
      row("Node Type") do |attribute|
        attribute.chart&.profile&.context_node_type&.node_type&.name
      end
      row("Profile Type") { |attribute| attribute.chart&.profile&.name }
      row :chart
      row :identifier
      row :position
      row :display_name
      row :legend_name
      row :display_type
      row :display_style
      row :state_average
      row("Years", &:years_str)
      row :created_at
      row :updated_at
    end
  end

  filter :chart_profile_context_node_type_context_country_id,
         label: "Country",
         as: :select,
         collection: -> { Api::V3::Country.select_options }

  filter :chart_profile_context_node_type_context_commodity_id,
         label: "Commodity",
         as: :select,
         collection: -> { Api::V3::Commodity.select_options }

  filter :chart_profile_context_node_type_context_id,
         label: "Context",
         as: :select,
         collection: -> { Api::V3::Context.select_options }

  filter :chart_profile_context_node_type_node_type_id,
         label: "Node type",
         as: :select,
         collection: -> { Api::V3::NodeType.select_options }

  filter :chart_profile_name,
         label: "Profile type",
         as: :select,
         collection: -> { Api::V3::Profile::NAMES }

  filter :chart_profile_id,
         as: :select,
         collection: -> { Api::V3::Profile.select_options }

  filter :chart, collection: -> { Api::V3::Chart.select_options }

  filter :chart_identifier,
         label: "Chart identifier",
         as: :select,
         collection: -> { Api::V3::Chart.distinct.pluck(:identifier).sort }
end
