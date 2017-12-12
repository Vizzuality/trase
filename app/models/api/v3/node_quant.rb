module Api
  module V3
    class NodeQuant < BaseModel
      belongs_to :quant
      belongs_to :node
    end
  end
end
