module Api
  module V3
    class Node < BaseModel
      belongs_to :node_type
    end
  end
end
