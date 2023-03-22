shared_context "api v3 brazil palm oil nodes" do
  include_context "api v3 node types"
  include_context "api v3 brazil palm oil context node types"

  let!(:api_v3_brazil_palm_oil_country_of_production_node) do
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

  let!(:api_v3_brazil_palm_oil_port_of_export_node) do
    node = Api::V3::Node.where(
      name: "BELEM", node_type_id: api_v3_port_of_export_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "BELEM",
        node_type: api_v3_exporter_node_type,
        geo_id: "WPI-12490"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let!(:api_v3_brazil_palm_oil_exporter_node) do
    node = Api::V3::Node.where(
      name: "AGROPALMA S/A", node_type_id: api_v3_exporter_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "AGROPALMA S/A",
        node_type: api_v3_exporter_node_type
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let!(:api_v3_brazil_palm_oil_country_node) do
    node = Api::V3::Node.where(
      name: "GERMANY", node_type_id: api_v3_country_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "GERMANY",
        node_type: api_v3_country_node_type,
        geo_id: "DE"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let!(:api_v3_brazil_palm_oil_economic_bloc_node) do
    node = Api::V3::Node.where(
      name: "EUROPEAN UNION", node_type_id: api_v3_country_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "EUROPEAN UNION",
        node_type: api_v3_country_node_type,
        geo_id: "EU"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end
end
