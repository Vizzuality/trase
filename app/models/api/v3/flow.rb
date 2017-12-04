module Api
  module V3
    class Flow < BaseModel
      belongs_to :context
      has_many :flow_inds
      has_many :flow_quals
      has_many :flow_quants
    end
  end
end
