shared_context "api v3 paraguay context node types" do
  include_context "api v3 paraguay context"
  include_context "api v3 node types"

  let!(:api_v3_paraguay_soy_country_of_production_context_node_type) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_paraguay_context.id, node_type_id: api_v3_country_of_production_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_paraguay_context,
        node_type: api_v3_country_of_production_node_type,
        column_position: 0
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 0
      )
    end
    cnt
  end

  let!(:api_v3_paraguay_biome_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_paraguay_context.id, node_type_id: api_v3_biome_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_paraguay_context,
        node_type: api_v3_biome_node_type,
        column_position: 1
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 0
      )
    end
    cnt
  end

  let!(:api_v3_paraguay_department_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_paraguay_context.id, node_type_id: api_v3_department_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_paraguay_context,
        node_type: api_v3_department_node_type,
        column_position: 2
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 0,
        role: "source",
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
        column_position: 3
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 1,
        role: "exporter"
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
        column_position: 4
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 2,
        role: "importer"
      )
    end
    cnt
  end

  let!(:api_v3_paraguay_soy_country_of_destination_context_node_type) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_paraguay_context.id, node_type_id: api_v3_country_of_destination_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_paraguay_context,
        node_type: api_v3_country_of_destination_node_type,
        column_position: 5
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 3,
        role: "destination"
      )
    end
    cnt
  end
end
