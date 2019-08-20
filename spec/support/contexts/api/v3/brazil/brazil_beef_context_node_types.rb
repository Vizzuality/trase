shared_context 'api v3 brazil beef context node types' do
  include_context 'api v3 brazil contexts'
  include_context 'api v3 node types'

  let!(:api_v3_brazil_beef_country_of_production_context_node_type) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_brazil_beef_context.id,
      node_type_id: api_v3_country_of_production_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_brazil_beef_context,
        node_type: api_v3_country_of_production_node_type,
        column_position: 0
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 0,
        role: 'source',
        is_default: true
      )
    end
    cnt
  end
  let!(:api_v3_brazil_beef_port_of_export_context_node_type) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_brazil_beef_context.id,
      node_type_id: api_v3_port_of_export_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_brazil_beef_context,
        node_type: api_v3_port_of_export_node_type,
        column_position: 1
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 1,
        role: 'exporter'
      )
    end
    cnt
  end
  let!(:api_v3_brazil_beef_exporter_context_node_type) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_brazil_beef_context.id,
      node_type_id: api_v3_exporter_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_brazil_beef_context,
        node_type: api_v3_exporter_node_type,
        column_position: 2
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 1,
        role: 'exporter'
      )
    end
    cnt
  end
  let!(:api_v3_brazil_beef_importer_context_node_type) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_brazil_beef_context.id,
      node_type_id: api_v3_importer_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_brazil_beef_context,
        node_type: api_v3_importer_node_type,
        column_position: 3
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 2,
        role: 'importer'
      )
    end
    cnt
  end
  let!(:api_v3_brazil_beef_country_of_destination_context_node_type) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_brazil_beef_context.id,
      node_type_id: api_v3_country_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_brazil_beef_context,
        node_type: api_v3_country_node_type,
        column_position: 4
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 3,
        role: 'destination'
      )
    end
    cnt
  end
end
