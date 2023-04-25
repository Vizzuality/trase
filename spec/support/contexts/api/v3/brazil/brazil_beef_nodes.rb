shared_context "api v3 brazil beef nodes" do
  include_context "api v3 node types"
  include_context "api v3 brazil beef context node types"

  let!(:api_v3_brazil_beef_country_of_production_node) do
    node = Api::V3::Node.where(
      name: "BRAZIL", node_type_id: api_v3_country_of_production_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "BRAZIL",
        node_type: api_v3_country_of_production_node_type,
        geo_id: "BR"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let!(:api_v3_brazil_beef_port_of_export_node) do
    node = Api::V3::Node.where(
      name: "SAO FRANCISCO DO SUL", node_type_id: api_v3_port_of_export_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "SAO FRANCISCO DO SUL",
        node_type: api_v3_exporter_node_type,
        geo_id: "WPI-13000"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let!(:api_v3_brazil_beef_exporter_node) do
    node = Api::V3::Node.where(
      name: "JBS S/A", node_type_id: api_v3_exporter_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "JBS S/A",
        node_type: api_v3_exporter_node_type
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let!(:api_v3_importer_node) do
    node = Api::V3::Node.where(
      name: "OOO ELITA-FOODS", node_type_id: api_v3_importer_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "OOO ELITA-FOODS",
        node_type: api_v3_importer_node_type
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let!(:api_v3_country_of_destination_node) do
    node = Api::V3::Node.where(
      name: "RUSSIAN FEDERATION", node_type_id: api_v3_country_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "RUSSIAN FEDERATION",
        node_type: api_v3_country_node_type,
        geo_id: "RU"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end
end
