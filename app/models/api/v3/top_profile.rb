module Api
  module V3
    class TopProfile < BlueTable
      belongs_to :context
      belongs_to :node
    end
  end
end
