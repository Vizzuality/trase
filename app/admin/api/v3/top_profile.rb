ActiveAdmin.register Api::V3::TopProfile, as: 'Top Profile' do
  belongs_to :context, class_name: 'Api::V3::Context'
  permit_params :context_id, :node_id
  config.filters = false

  index do
    column('Node name') { |property| property&.node&.name }
    actions
  end

  form do |f|
    context_id = params[:context_id].to_i
    profiles_for_specified_context =
      Api::V3::Profile.joins(:context_node_type).where(context_node_types: {context_id: context_id})
    node_type_ids = profiles_for_specified_context.pluck(:node_type_id)
    node_type_names = Api::V3::NodeType.where(id: node_type_ids).pluck(:name)
    available_nodes = Api::V3::Readonly::Node.where(context_id: context_id, node_type: node_type_names)
    f.semantic_errors
    inputs do
      input :node, as: :select, required: true,
                   collection: available_nodes
    end
    f.actions
  end

  show do
    attributes_table do
      row('Country') { |property| property&.context&.country&.name }
      row('Commodity') { |property| property&.context&.commodity&.name }
      row('Node name') { |property| property&.node&.name }
    end
  end
end
