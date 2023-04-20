shared_context "api v3 paraguay soy nodes" do
  include_context "api v3 node types"
  include_context "api v3 quals"
  include_context "api v3 paraguay context node types"

  let!(:api_v3_paraguay_soy_country_of_production_node) {
    node = Api::V3::Node.where(
      name: "PARAGUAY", node_type_id: api_v3_country_of_production_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "PARAGUAY",
        node_type: api_v3_country_of_production_node_type,
        geo_id: "PY"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  }

  let!(:api_v3_paraguay_biome_node) do
    node = Api::V3::Node.where(
      name: "CHACO SECO", node_type_id: api_v3_biome_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "CHACO SECO",
        node_type: api_v3_biome_node_type,
        geo_id: "BR1"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let!(:api_v3_paraguay_department_node) do
    node = Api::V3::Node.where(
      name: "ALTO PARANA", node_type_id: api_v3_department_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "ALTO PARANA",
        node_type: api_v3_department_node_type,
        geo_id: "PY10",
        main_id: 29_838
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let!(:api_v3_paraguay_customs_department_node) do
    node = Api::V3::Node.where(
      name: "ALTO PARANA", node_type_id: api_v3_customs_department_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "ALTO PARANA",
        node_type: api_v3_customs_department_node_type,
        geo_id: "PY10",
        main_id: 29_838
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let!(:api_v3_paraguay_exporter_node) do
    node = Api::V3::Node.where(
      name: "CARGILL", node_type_id: api_v3_exporter_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "CARGILL",
        node_type: api_v3_exporter_node_type
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let!(:api_v3_paraguay_country_of_destination_node) do
    node = Api::V3::Node.where(
      name: "BANGLADESH", node_type_id: api_v3_country_of_destination_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "BANGLADESH",
        node_type: api_v3_country_of_destination_node_type,
        geo_id: "BD"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end
end
