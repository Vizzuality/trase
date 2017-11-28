module Api
  module V3
    module Flows
      class FlowsResultSerializer < ActiveModel::Serializer
        attributes :data, :include
      end
    end
  end
end
