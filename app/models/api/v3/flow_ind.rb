module Api
  module V3
    class FlowInd < BaseModel
      belongs_to :flow
      belongs_to :ind
    end
  end
end
