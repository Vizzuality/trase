shared_context "api v3 indonesia palm oil nodes" do
  include_context "api v3 node types"
  include_context "api v3 quals"

  let(:api_v3_indonesia_country_of_production_node) do
    node = Api::V3::Node.where(
      name: "INDONESIA", node_type_id: api_v3_country_of_production_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "INDONESIA",
        node_type: api_v3_country_of_production_node_type,
        geo_id: "ID"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let(:api_v3_indonesia_kabupaten_node) do
    node = Api::V3::Node.where(
      name: "ROKAN HILIR", node_type_id: api_v3_kabupaten_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "ROKAN HILIR",
        node_type: api_v3_kabupaten_node_type,
        geo_id: "ID-1409"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let(:api_v3_indonesia_mill_node) do
    node = Api::V3::Node.where(
      name: "PT. SUMATERAMAKMUR LESTARI", node_type_id: api_v3_mill_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "PT. SUMATERAMAKMUR LESTARI",
        node_type: api_v3_mill_node_type
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let(:api_v3_indonesia_port_of_export_node) do
    node = Api::V3::Node.where(
      name: "DUMAI", node_type_id: api_v3_port_of_export_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "DUMAI",
        node_type: api_v3_port_of_export_node_type
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let(:api_v3_indonesia_exporter_node) do
    node = Api::V3::Node.where(
      name: "INTIBENUA PERKASATAMA", node_type_id: api_v3_exporter_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "INTIBENUA PERKASATAMA",
        node_type: api_v3_exporter_node_type
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let(:api_v3_indonesia_importer_node) do
    node = Api::V3::Node.where(
      name: "INTER-CONTINENTAL OILS & FATS", node_type_id: api_v3_importer_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "INTER-CONTINENTAL OILS & FATS",
        node_type: api_v3_importer_node_type
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let(:api_v3_indonesia_economic_bloc_node) do
    node = Api::V3::Node.where(
      name: "BRAZIL", node_type_id: api_v3_economic_bloc_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "BRAZIL",
        node_type: api_v3_economic_bloc_node_type,
        geo_id: "BR"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let(:api_v3_indonesia_country_node) do
    node = Api::V3::Node.where(
      name: "BRAZIL", node_type_id: api_v3_country_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "BRAZIL",
        node_type: api_v3_country_node_type,
        geo_id: "BR"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end
end
