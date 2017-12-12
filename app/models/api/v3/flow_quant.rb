module Api
  module V3
    class FlowQuant < BaseModel
      belongs_to :flow
      belongs_to :quant
    end
  end
end
