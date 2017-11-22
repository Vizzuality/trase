module Api
  module V3
    class NodeProperty < BaseModel
      belongs_to :node
    end
  end
end
