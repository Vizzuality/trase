module Api
  module V3
    class FlowQual < BaseModel
      belongs_to :flow
      belongs_to :qual
    end
  end
end
