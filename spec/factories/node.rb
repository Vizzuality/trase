FactoryGirl.define do
  factory :node do
    node_type do
      NodeType.find_by(node_type: node_type_name) || FactoryGirl.create(:node_type, node_type: node_type_name)
    end
    factory :biome_node do
      transient { node_type_name NodeType::BIOME }
    end
    factory :state_node do
      transient { node_type_name NodeType::STATE }
    end
    factory :logistics_hub_node do
      transient { node_type_name NodeType::LOGISTICS_HUB }
    end
    factory :municipality_node do
      transient { node_type_name NodeType::MUNICIPALITY }
    end
    factory :exporter_node do
      transient { node_type_name NodeType::EXPORTER }
    end
    factory :port_node do
      transient { node_type_name NodeType::PORT }
    end
    factory :importer_node do
      transient { node_type_name NodeType::IMPORTER }
    end
    factory :country_node do
      transient { node_type_name NodeType::COUNTRY }
    end
  end

  factory :node_type do
    node_type 'MUNICIPALITY'
  end
end

