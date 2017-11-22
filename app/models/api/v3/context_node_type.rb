module Api
  module V3
    class ContextNodeType < BaseModel
      belongs_to :node_type
      belongs_to :context
      has_one :context_node_type_property
      has_many :profiles
    end
  end
end
