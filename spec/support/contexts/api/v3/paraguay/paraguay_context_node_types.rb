shared_context 'api v3 paraguay context node types' do
  include_context 'api v3 paraguay context'
  include_context 'api v3 node types'

  let!(:api_v3_paraguay_department_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_paraguay_context.id, node_type_id: api_v3_department_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_paraguay_context,
        node_type: api_v3_department_node_type,
        column_position: 0
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 0,
        is_geo_column: true
      )
    end
    cnt
  end

  let!(:api_v3_paraguay_customs_department_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_paraguay_context.id, node_type_id: api_v3_customs_department_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_paraguay_context,
        node_type: api_v3_customs_department_node_type,
        column_position: 1
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 1
      )
    end
    cnt
  end

  let!(:api_v3_paraguay_exporter_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_paraguay_context.id, node_type_id: api_v3_exporter_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_paraguay_context,
        node_type: api_v3_exporter_node_type,
        column_position: 2
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 2
      )
    end
    cnt
  end

  let!(:api_v3_paraguay_country_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_paraguay_context.id, node_type_id: api_v3_country_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_paraguay_context,
        node_type: api_v3_country_node_type,
        column_position: 3
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 3
      )
    end
    cnt
  end
end
