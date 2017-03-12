class FilterBySerializer < ActiveModel::Serializer
  attribute :name do
    object.node_type.node_type
  end

  attribute :nodes do
    nodes = []
    object.node_type.nodes.each do |node|
      nodes.push(
          {
              node_id: node.id,
              name: node.name,
          }
      ) unless node.name.eql?('OTHER') or node.name.starts_with?('UNKNOWN')
    end
    nodes
  end
end
