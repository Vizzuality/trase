module Api
  module V3
    class NodeType < BaseModel
      has_many :context_node_types
      has_many :nodes
    end
  end
end
