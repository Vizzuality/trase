ActiveAdmin.register Api::V3::NodeProperty, as: "NodeProperty" do
  menu parent: "General", priority: 5

  permit_params :node_id, :is_domestic_consumption

  after_action :clear_cache, only: [:create, :update, :destroy]

  controller do
    def clear_cache
      clear_cache_for_regexp("/api/v3/contexts")
    end
  end

  form do |f|
    f.semantic_errors
    inputs do
      input :node,
            as: :select,
            required: true,
            collection: Api::V3::Node.select_options
      input :is_domestic_consumption,
            as: :boolean,
            required: true,
            hint: object.class.column_comment("is_domestic_consumption")
    end
    f.actions
  end

  index do
    column("Node") { |property| property.node&.name }
    column("Node Type") { |property| property.node&.node_type&.name }
    column :is_domestic_consumption
    actions
  end

  filter :node_node_type_id, as: :select, collection: -> { Api::V3::NodeType.select_options }
  filter :node_name_cont, as: :string, label: "Node name"
end
