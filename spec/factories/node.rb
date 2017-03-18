FactoryGirl.define do
  factory :node do
    node_type do
      NodeType.find_by(node_type: node_type_name) || FactoryGirl.create(:node_type, node_type: node_type_name)
    end
    factory :biome_node do
      transient { node_type_name NodeTypeName::BIOME }
    end
    factory :state_node do
      transient { node_type_name NodeTypeName::STATE }
    end
    factory :logistics_hub_node do
      transient { node_type_name NodeTypeName::LOGISTICS_HUB }
    end
    factory :municipality_node do
      transient { node_type_name NodeTypeName::MUNICIPALITY }
    end
    factory :exporter_node do
      transient { node_type_name NodeTypeName::EXPORTER }
    end
    factory :port_node do
      transient { node_type_name NodeTypeName::PORT }
    end
    factory :importer_node do
      transient { node_type_name NodeTypeName::IMPORTER }
    end
    factory :country_node do
      transient { node_type_name NodeTypeName::COUNTRY }
    end
  end

  factory :node_type do
    node_type 'MUNICIPALITY'
  end
end

