module Api
  module V3
    class Node < BaseModel
      belongs_to :node_type
      has_one :node_property
    end
  end
end
