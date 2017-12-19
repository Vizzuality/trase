module Api
  module V3
    class NodeInd < BaseModel
      belongs_to :ind
      belongs_to :node
    end
  end
end
