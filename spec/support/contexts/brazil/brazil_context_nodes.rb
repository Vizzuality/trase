shared_context 'brazil context nodes' do
  include_context 'brazil contexts'
  include_context 'node types'

  let!(:biome_context_node) do
    ContextNode.where(
      context_id: context.id, node_type_id: biome_node_type.id
    ).first ||
      FactoryBot.create(
        :context_node,
        context: context,
        node_type: biome_node_type,
        column_position: 0,
        column_group: 0
      )
  end
  let!(:state_context_node) do
    ContextNode.where(
      context_id: context.id, node_type_id: state_node_type.id
    ).first ||
      FactoryBot.create(
        :context_node,
        context: context,
        node_type: state_node_type,
        column_position: 1,
        column_group: 0
      )
  end
  let!(:municipality_context_node) do
    ContextNode.where(
      context_id: context.id, node_type_id: municipality_node_type.id
    ).first ||
      FactoryBot.create(
        :context_node,
        context: context,
        node_type: municipality_node_type,
        column_position: 2,
        column_group: 0,
        is_default: true,
        profile_type: 'place'
      )
  end
  let!(:logistics_hub_context_node) do
    ContextNode.where(
      context_id: context.id, node_type_id: logistics_hub_node_type.id
    ).first ||
      FactoryBot.create(
        :context_node,
        context: context,
        node_type: logistics_hub_node_type,
        column_position: 3,
        column_group: 0
      )
  end
  let!(:port1_context_node) do
    ContextNode.where(
      context_id: context.id, node_type_id: port_node_type.id
    ).first ||
      FactoryBot.create(
        :context_node,
        context: context,
        node_type: port_node_type,
        column_position: 4,
        column_group: 1
      )
  end
  let!(:exporter1_context_node) do
    ContextNode.where(
      context_id: context.id, node_type_id: exporter_node_type.id
    ).first ||
      FactoryBot.create(
        :context_node,
        context: context,
        node_type: exporter_node_type,
        column_position: 5,
        column_group: 1,
        profile_type: 'actor'
      )
  end
  let!(:importer1_context_node) do
    ContextNode.where(
      context_id: context.id, node_type_id: importer_node_type.id
    ).first ||
      FactoryBot.create(
        :context_node,
        context: context,
        node_type: importer_node_type,
        column_position: 6,
        column_group: 2,
        profile_type: 'actor'
      )
  end
  let!(:country_of_destination1_context_node) do
    ContextNode.where(
      context_id: context.id, node_type_id: country_node_type.id
    ).first ||
      FactoryBot.create(
        :context_node,
        context: context,
        node_type: country_node_type,
        column_position: 7,
        column_group: 3
      )
  end
end
