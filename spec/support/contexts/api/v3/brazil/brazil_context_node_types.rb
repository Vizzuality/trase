shared_context "api v3 brazil context node types" do
  include_context "api v3 brazil soy context"
  include_context "api v3 node types"

  let!(:api_v3_biome_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_brazil_soy_context.id, node_type_id: api_v3_biome_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_brazil_soy_context,
        node_type: api_v3_biome_node_type,
        column_position: 0
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        is_geo_column: true,
        column_group: 0,
        role: "source"
      )
    end
    cnt
  end
  let!(:api_v3_state_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_brazil_soy_context.id, node_type_id: api_v3_state_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_brazil_soy_context,
        node_type: api_v3_state_node_type,
        column_position: 1
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        is_geo_column: true,
        column_group: 0,
        role: "source"
      )
    end
    cnt
  end
  let!(:api_v3_municipality_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_brazil_soy_context.id, node_type_id: api_v3_municipality_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_brazil_soy_context,
        node_type: api_v3_municipality_node_type,
        column_position: 2
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 0,
        is_geo_column: true,
        role: "source",
        is_default: true
      )
    end
    cnt
  end
  let!(:api_v3_logistics_hub_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_brazil_soy_context.id, node_type_id: api_v3_logistics_hub_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_brazil_soy_context,
        node_type: api_v3_logistics_hub_node_type,
        column_position: 3
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 0,
        is_geo_column: true,
        role: "source"
      )
    end
    cnt
  end
  let!(:api_v3_port1_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_brazil_soy_context.id, node_type_id: api_v3_port_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_brazil_soy_context,
        node_type: api_v3_port_node_type,
        column_position: 4
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 1,
        is_geo_column: false,
        role: "exporter"
      )
    end
    cnt
  end
  let!(:api_v3_exporter1_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_brazil_soy_context.id, node_type_id: api_v3_exporter_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_brazil_soy_context,
        node_type: api_v3_exporter_node_type,
        column_position: 5
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 1,
        is_geo_column: false,
        role: "exporter"
      )
    end
    cnt
  end
  let!(:api_v3_importer1_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_brazil_soy_context.id, node_type_id: api_v3_importer_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_brazil_soy_context,
        node_type: api_v3_importer_node_type,
        column_position: 6
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 2,
        is_geo_column: false,
        role: "importer"
      )
    end
    cnt
  end
  let!(:country_of_destination1_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_brazil_soy_context.id, node_type_id: api_v3_country_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_brazil_soy_context,
        node_type: api_v3_country_node_type,
        column_position: 7
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 3,
        is_geo_column: false,
        role: "destination"
      )
    end
    cnt
  end
end
