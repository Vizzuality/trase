module Api
  module V3
    class NodeQual < BaseModel
      belongs_to :qual
      belongs_to :node
    end
  end
end
