module Api
  module V3
    class Flow < BaseModel
      has_many :flow_inds
      has_many :flow_quals
      has_many :flow_quants
    end
  end
end
