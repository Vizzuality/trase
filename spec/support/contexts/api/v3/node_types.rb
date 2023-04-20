shared_context "api v3 node types" do
  let(:api_v3_country_of_production_node_type) do
    Api::V3::NodeType.find_by_name(NodeTypeName::COUNTRY_OF_PRODUCTION) ||
      FactoryBot.create(:api_v3_node_type, name: NodeTypeName::COUNTRY_OF_PRODUCTION)
  end
  let(:api_v3_biome_node_type) do
    Api::V3::NodeType.find_by_name(NodeTypeName::BIOME) ||
      FactoryBot.create(:api_v3_node_type, name: NodeTypeName::BIOME)
  end
  let(:api_v3_state_node_type) do
    Api::V3::NodeType.find_by_name(NodeTypeName::STATE) ||
      FactoryBot.create(:api_v3_node_type, name: NodeTypeName::STATE)
  end
  let(:api_v3_logistics_hub_node_type) do
    Api::V3::NodeType.find_by_name(NodeTypeName::LOGISTICS_HUB) ||
      FactoryBot.create(:api_v3_node_type, name: NodeTypeName::LOGISTICS_HUB)
  end
  let(:api_v3_municipality_node_type) do
    Api::V3::NodeType.find_by_name(NodeTypeName::MUNICIPALITY) ||
      FactoryBot.create(:api_v3_node_type, name: NodeTypeName::MUNICIPALITY)
  end
  let(:api_v3_exporter_node_type) do
    Api::V3::NodeType.find_by_name(NodeTypeName::EXPORTER) ||
      FactoryBot.create(:api_v3_node_type, name: NodeTypeName::EXPORTER)
  end
  let(:api_v3_port_of_export_node_type) do
    Api::V3::NodeType.find_by_name(NodeTypeName::PORT_OF_EXPORT) ||
      FactoryBot.create(:api_v3_node_type, name: NodeTypeName::PORT_OF_EXPORT)
  end
  let(:api_v3_port_node_type) do
    Api::V3::NodeType.find_by_name(NodeTypeName::PORT) ||
      FactoryBot.create(:api_v3_node_type, name: NodeTypeName::PORT)
  end
  let(:api_v3_importer_node_type) do
    Api::V3::NodeType.find_by_name(NodeTypeName::IMPORTER) ||
      FactoryBot.create(:api_v3_node_type, name: NodeTypeName::IMPORTER)
  end
  let(:api_v3_country_node_type) do
    Api::V3::NodeType.find_by_name(NodeTypeName::COUNTRY) ||
      FactoryBot.create(:api_v3_node_type, name: NodeTypeName::COUNTRY)
  end
  let(:api_v3_department_node_type) do
    Api::V3::NodeType.find_by_name(NodeTypeName::DEPARTMENT) ||
      FactoryBot.create(:api_v3_node_type, name: NodeTypeName::DEPARTMENT)
  end
  let(:api_v3_customs_department_node_type) do
    Api::V3::NodeType.find_by_name(NodeTypeName::CUSTOMS_DEPARTMENT) ||
      FactoryBot.create(:api_v3_node_type, name: NodeTypeName::CUSTOMS_DEPARTMENT)
  end
  let(:api_v3_economic_bloc_node_type) do
    Api::V3::NodeType.find_by_name(NodeTypeName::ECONOMIC_BLOC) ||
      FactoryBot.create(:api_v3_node_type, name: NodeTypeName::ECONOMIC_BLOC)
  end
  let(:api_v3_country_of_destination_node_type) do
    Api::V3::NodeType.find_by_name(NodeTypeName::COUNTRY_OF_DESTINATION) ||
      FactoryBot.create(:api_v3_node_type, name: NodeTypeName::COUNTRY_OF_DESTINATION)
  end
  let(:api_v3_country_of_first_import_node_type) do
    Api::V3::NodeType.find_by_name(NodeTypeName::COUNTRY_OF_FIRST_IMPORT) ||
      FactoryBot.create(:api_v3_node_type, name: NodeTypeName::COUNTRY_OF_FIRST_IMPORT)
  end
end
