module Api
  module V3
    class ContextNodeType < BaseModel
      belongs_to :node_type
      belongs_to :context
      has_one :context_node_type_property
      has_one :profile
    end
  end
end
